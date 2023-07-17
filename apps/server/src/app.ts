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

let rooms = new Map<string, Room>()

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
        buzzed: null,
        banBuzzed: null,
        delay: 1000 * 10,
        lastActivity: Date.now(),
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

      room.connections.set(username, connection.socket)
      room.lastActivity = Date.now()

      function broadcast(message: any) {
        for (const socket of Array.from(room.connections.values()))
          socket.send(JSON.stringify(message))
      }

      broadcast({ type: "list", users: Array.from(room.connections.keys()), admin: room.admin })

      connection.socket.on("message", (buffer: Buffer) => {
        const message = JSON.parse(buffer.toString()) as any
        room.lastActivity = Date.now()

        switch (message.type) {
          case "buzz":
            if (room.buzzed === null && room.banBuzzed !== username) {
              room.buzzed = username

              broadcast({ type: "buzz", username, expireAt: Date.now() + room.delay })

              if (room.delay !== Infinity)
                setTimeout(() => {
                  if (room.buzzed === username) {
                    room.buzzed = null
                    room.banBuzzed = username

                    connection.socket.send(
                      JSON.stringify({ type: "ban", unBanAt: Date.now() + room.delay })
                    )

                    setTimeout(() => {
                      if (room.banBuzzed === username) room.banBuzzed = null
                    }, room.delay)

                    broadcast({ type: "clear" })
                  }
                }, room.delay)
            }
            break
          case "clear":
            if (isRoomAdmin) {
              room.buzzed = null
              room.banBuzzed = null

              broadcast({ type: "clear" })
            }
            break
          default:
            break
        }
      })

      connection.socket.on("close", () => {
        room.connections.delete(username)
        if (room.buzzed === username) room.buzzed = null
        if (room.banBuzzed === username) room.banBuzzed = null

        console.log(`Connection closed {${username}} to {${roomId}}`)

        if (room.connections.size === 0) {
          rooms.delete(roomId)
          console.log(`Room deleted {${roomId}}`)
        } else {
          broadcast({ type: "list", users: Array.from(room.connections.keys()) })
        }
      })
    })

    return instance
  },
  { prefix: "/api" }
)

app
  .listen({ port })
  .then((url) => console.log(`Server listening on ${url}`))
  .catch((err) => console.error("server crash", err))
