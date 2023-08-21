import path from "node:path"
import { Worker } from "node:worker_threads"

import { fastify } from "fastify"
import fastifyCors from "@fastify/cors"
import fastifyWebsocket from "@fastify/websocket"
import fastifyStatic from "@fastify/static"

import dotenv from "dotenv"

import { generateRandomCode } from "./utils/generateRandomCode"

const app = fastify()

dotenv.config({})

const port: number = +(process.env.APP_PORT as string)

app.register(fastifyCors, { origin: "*" })
app.register(fastifyWebsocket)

const rooms = new Map<string, Worker>()

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

      const code = generateRandomCode(new Set(rooms.keys()))

      const worker = new Worker(`${__dirname}/workers/game.js`, {
        workerData: { code, admin: username },
      })

      rooms.set(code, worker)

      console.log("Rooms", rooms)

      reply.status(201).send({ id: code, username })
    })

    instance.get<{
      Params: { id: string }
      Querystring: { username: string }
    }>("/room/:id", { websocket: true }, (connection, request) => {
      const roomId = request.params.id
      const username = request.query.username

      console.log("Rooms.has()", rooms.has(roomId))

      if (!roomId || !username) return connection.socket.close(4000, "Missing params")
      if (username.length > 20) return connection.socket.close(4004, "Username too long")
      if (username.length < 3) return connection.socket.close(4005, "Username too short")
      if (!rooms.has(roomId)) return connection.socket.close(4001, "Room not found")

      const worker = rooms.get(roomId)!

      worker.postMessage({ type: "join", username, socket: connection.socket })

      connection.socket.send(JSON.stringify({ type: "list", users: [] }))

      connection.socket.on("message", (buffer) => {
        const message = JSON.parse(buffer.toString())

        worker.postMessage({ type: message.type, data: message.data })
      })

      connection.socket.on("close", () => {
        console.log("close")

        worker.postMessage({ type: "leave", username })
      })
    })

    return instance
  },
  { prefix: "/api" }
)

app
  .listen({ port })
  .then((url) => console.log("server running ", url))
  .catch((err) => console.error("server crash", err))
