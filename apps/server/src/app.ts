import path from "node:path"

import { fastify } from "fastify"
import fastifyCors from "@fastify/cors"
import fastifyWebsocket from "@fastify/websocket"
import fastifyStatic from "@fastify/static"
import fastifySchedulePlugin from "@fastify/schedule"

import dotenv from "dotenv"

import { generateRandomCode } from "./utils/generateRandomCode"
import { Room } from "./types"

import { AsyncTask, CronJob } from "toad-scheduler"

const app = fastify()

dotenv.config({})

const port: number = +(process.env.APP_PORT as string)

app.register(fastifyCors, { origin: "*" })
app.register(fastifyWebsocket)

const rooms = new Map<string, Room>()

app
  .register(fastifyStatic, { root: path.join(__dirname, "client"), prefix: "/" })
  .setNotFoundHandler((req, reply) => void reply.sendFile("index.html"))

app
  .register(fastifySchedulePlugin)
  .ready()
  .then(() => {
    const task = new AsyncTask(
      "clear-rooms",
      async () => {
        for (const [key, room] of Array.from(rooms)) {
          if (Date.now() - room.lastActivity > 1000 * 60 * 5) {
            console.log(`Close inactive room {${key}} with {${room.connections.size}} connections`)

            for (const socket of Array.from(room.connections.values()))
              socket.close(4007, "La session à été fermé due à sont inactivité")

            rooms.delete(key)
          }
        }
      },
      (err) => console.error("CRON JOB ERROR", err.name, err.message)
    )

    const clearRooms = new CronJob({ cronExpression: "*/5 * * * *" }, task, {
      preventOverrun: true,
    })

    app.scheduler.addCronJob(clearRooms)
  })

app.register(
  async (instance) => {
    instance.post<{ Body: { username: string } }>("/room", (request, reply) => {
      const username = request.body.username

      if (username.length > 20)
        return reply.status(400).send({ error: "Nom d'utilisateur trop long" })
      else if (username.length < 3)
        return reply.status(400).send({ error: "Nom d'utilisateur trop court" })
      else if (rooms.size > 10)
        return reply.status(400).send({ error: "Le nombre de session en cours est atteint !" })

      const code = generateRandomCode(new Set(rooms.keys()))

      rooms.set(code, {
        connections: new Map(),
        admin: request.body.username,
        responses: new Map(),
        scores: new Map(),
        play: false,
        lastActivity: Date.now(),
        interval: null,
        parameter: {
          time: 5 * 1000,
        },
        broadcast: function (message) {
          for (const socket of Array.from(this.connections.values())) socket.send(message)
        },
      })

      console.log(`Room cretead {${code}} by {${username}}`)

      reply.status(201).send({ id: code, username })
    })

    instance.get<{
      Params: { id: string }
      Querystring: { username: string }
    }>("/room/:id", { websocket: true }, (connection, request) => {
      const roomId = request.params.id
      const username = request.query.username

      if (!roomId || !username) return connection.socket.close(4000, "Missing params")
      if (username.length > 20) return connection.socket.close(4004, "Username too long")
      if (username.length < 3) return connection.socket.close(4005, "Username too short")
      if (!rooms.has(roomId)) return connection.socket.close(4001, "Room not found")

      const room = rooms.get(roomId) as Room

      if (room.connections.size >= 10)
        return connection.socket.close(4006, "Le nombre de participants max est atteint !")

      const isRoomAdmin = room.admin === username

      if (room.connections.has(username))
        return connection.socket.close(4002, "le nom d'utilisateur est déjà pris")

      console.log(`Connection established {${username}} to {${roomId}}`)

      room.lastActivity = Date.now()
      room.connections.set(username, connection.socket)
      room.scores.set(username, 0)

      room.broadcast({
        type: "list",
        users: Array.from(room.connections.keys()),
        admin: room.admin,
      })

      connection.socket.on("message", (buffer: Buffer) => {
        const message = JSON.parse(buffer.toString()) as any
        room.lastActivity = Date.now()

        switch (message.type) {
          case "start":
            if (isRoomAdmin) {
              room.play = true
              room.broadcast({ type: "start" })
            }
            break
          case "pause":
            if (isRoomAdmin && room.play) {
              if (room.interval) clearInterval(room.interval as NodeJS.Timeout)

              room.interval = null
              room.play = false
              room.broadcast({ type: "pause" })
            }
            break
          case "add-response":
            if (room.play) {
              // si la réponse existe déjà, on la supprime
              if (room.responses.has(username)) room.responses.delete(username)

              // on ajoute la nouvelle réponse
              room.responses.set(username, message.response)

              // on renvoie la liste des répondeurs dans l'ordre
              room.broadcast({ type: "response", list: Array.from(room.responses.keys()) })
            }

            break
          default:
            break
        }
      })

      connection.socket.on("close", () => {
        room.connections.delete(username)

        if (room.connections.size === 0) {
          rooms.delete(roomId)
          console.log(`Room deleted {${roomId}}`)
        } else {
          room.broadcast({ type: "list", users: Array.from(room.connections.keys()) })
        }
      })
    })

    return instance
  },
  { prefix: "/api" }
)

app
  .listen({ port })
  .then(async (url) => {
    while (true) {
      for (const room of Object.values(rooms)) {
        if (!room.play || room.interval !== null) continue

        room.interval = setInterval(() => {
          room.broadcast({ type: "start-timer", time: room.parameter.time })
        }, room.time)
      }

      await new Promise((resolve) => setTimeout(resolve, 20))
    }
  })
  .catch((err) => console.error("server crash", err))
