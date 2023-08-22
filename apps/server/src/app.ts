import path from "node:path"
import { Worker } from "node:worker_threads"

import { fastify } from "fastify"
import fastifyCors from "@fastify/cors"
import fastifyWebsocket from "@fastify/websocket"
import fastifyStatic from "@fastify/static"

import type { Room } from "@Kbuzzer/common"
import { generateRandomCode } from "./utils/generateRandomCode"
import { APP_PORT, SESSION_PLAYER_LIMIT, SESSION_LIMIT, WORKERS_DIRECTORY } from "./utils/constants"
import { PHASE } from "@Kbuzzer/common"

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
      const code = generateRandomCode(new Set(rooms.keys()))

      const room: Room = {
        code: code,
        connections: new Map(),
        admin: username,
        worker: new Worker(`${WORKERS_DIRECTORY}/game.js`, {
          workerData: { code, admin: username },
        }),
        phase: PHASE.INIT,
      }

      rooms.set(code, room)

      console.log("room created", code, username)

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

      if (room.connections.has(username))
        return connection.socket.close(4003, "Username already taken")
      if (room.connections.size >= SESSION_PLAYER_LIMIT)
        return connection.socket.close(4006, "Session player limit reached")

      room.connections.set(username, connection.socket)

      console.log("room joined", roomId, username, room.connections.keys())

      function broadcast(type: string, data: object) {
        for (const socket of Array.from(room.connections.values()))
          socket.send(JSON.stringify({ type, data }))
      }

      room.worker.postMessage({ type: "join", username })
      connection.socket.send(
        JSON.stringify({ type: "info", data: { admin: room.admin, phase: room.phase } }),
      )

      room.worker.on("message", (message) => {
        console.log("Message from worker", message)

        if (message.type === "change-phase") room.phase = message.data.phase

        switch (message.type) {
          case "correct-answer":
          case "no-correct-answer":
          case "change-phase":
          case "player-list":
            return connection.socket.send(JSON.stringify(message))

          case "new-answer": {
            const index = message.data.answers.findIndex((answer: any) => answer.name === username)

            console.log("Message.data", username, index, message.data.answers)

            return connection.socket.send(
              JSON.stringify({
                type: message.type,
                data: {
                  total: message.data.answers.length,
                  you: index >= 0 ? index : null,
                },
              }),
            )
          }
        }
      })

      connection.socket.on("message", (buffer) => {
        const message = JSON.parse(buffer.toString())

        switch (message.type) {
          case "start-game":
            if (username === room.admin) room.worker.postMessage({ type: "start-game", username })
            break
          case "answer":
            room.worker.postMessage({
              type: "answer",
              username,
              data: {
                answer: message.data.answer,
              },
            })
            break
          case "skip-answer": {
            if (username === room.admin) {
              broadcast("skip-answer", {
                answer: message.data.username,
              })
            }

            break
          }
          case "validate-answer": {
            if (username === room.admin) {
              room.worker.postMessage({
                type: "validate",
                username,
                data: {
                  name: message.data.username,
                },
              })
            }
          }
          case "change-parameters":
            if (username === room.admin) {
              console.log("new parameter", message.data)

              room.worker.postMessage({
                type: "change-parameters",
                username,
                data: {
                  timeLimit: message.data.timeLimit,
                },
              })
            }
        }
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
