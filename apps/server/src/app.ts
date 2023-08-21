import path from "node:path"
import { Worker } from "node:worker_threads"

import { fastify } from "fastify"
import fastifyCors from "@fastify/cors"
import fastifyWebsocket from "@fastify/websocket"
import fastifyStatic from "@fastify/static"

import { generateRandomCode } from "./utils/generateRandomCode"
import { APP_PORT, SESSION_LIMIT, WORKERS_DIRECTORY } from "./utils/constants"
import { Room } from "./types"

const app = fastify()

app.register(fastifyCors, { origin: "*" })
app.register(fastifyWebsocket)

const rooms = new Map<string, Room>()

app
  .register(fastifyStatic, { root: path.join(__dirname, "client"), prefix: "/" })
  .setNotFoundHandler((req, reply) => void reply.sendFile("index.html"))

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

      // TODO : remove constante code
      const code = "CWN9K" || generateRandomCode(new Set(rooms.keys()))

      const room: Room = {
        code: code,
        connections: new Map(),
        admin: username,
        worker: new Worker(`${WORKERS_DIRECTORY}/game.js`, {
          workerData: { code, admin: username },
        }),
      }

      rooms.set(code, room)

      reply.status(201).send({ id: code, username })
    })

    instance.get<{
      Params: { id: string }
      Querystring: { username: string }
    }>("/room/:id", { websocket: true }, (connection, request) => {
      const roomId = request.params.id
      const username = request.query.username

      if (rooms.size >= SESSION_LIMIT) return connection.socket.close(4002, "Session limit reached")
      if (!roomId || !username) return connection.socket.close(4000, "Missing params")
      if (username.length > 20) return connection.socket.close(4004, "Username too long")
      if (username.length < 3) return connection.socket.close(4005, "Username too short")
      if (!rooms.has(roomId)) return connection.socket.close(4001, "Room not found")

      const room = rooms.get(roomId)!

      room.connections.set(username, connection.socket)

      function broadcast(type: string, data: object) {
        for (const socket of Array.from(room.connections.values()))
          socket.send(JSON.stringify({ type, data }))
      }

      room.worker.postMessage({ type: "join", username })

      room.worker.on("message", (message) => {
        console.log("Message from worker", message)

        switch (message.type) {
          case "player-list":
            return broadcast(message.type, message.data)
        }
      })

      connection.socket.on("message", (buffer) => {
        const message = JSON.parse(buffer.toString())

        console.log("message from socket", message)

        room.worker.postMessage({ type: message.type, data: message.data })
      })

      connection.socket.on("close", () => {
        console.log("close")

        room.connections.delete(username)
        room.worker.postMessage({ type: "leave", username })

        if (room.connections.size === 0) {
          console.log("Room Deleted", roomId)
          rooms.delete(roomId)
          room.worker.terminate()
        }
      })
    })

    instance.get("*", (request, reply) => {
      return reply.status(404).send({ error: "Not found" })
    })

    return instance
  },
  { prefix: "/api" },
)

app
  .listen({ port: APP_PORT })
  .then((url) => console.log("server running ", url))
  .catch((err) => console.error("server crash", err))
