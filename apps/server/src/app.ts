import { fastify } from "fastify"
import fastifyCors from "@fastify/cors"
import websocket from "@fastify/websocket"
import { WebSocket } from "ws"

import { generateRandomCode } from "./utils/generateRandomCode"

const app = fastify()

app.register(fastifyCors, { origin: "*" })
app.register(websocket)

declare type Room = {
  connections: Map<string, WebSocket>
  admin: string
  buzzedQueue: Set<string>
}

app.register(
  async (instance) => {
    let rooms = new Map<string, Room>()

    instance.post<{ Body: { username: string } }>("/room", (request, reply) => {
      const username = request.body.username

      if (username.length > 20) return reply.status(400).send({ error: "Username too long" })
      else if (username.length < 3) return reply.status(400).send({ error: "Username too short" })

      const code = generateRandomCode(new Set(rooms.keys()))

      console.log(`Room created {${code}} by {${username}}`)

      rooms.set(code, {
        connections: new Map(),
        admin: request.body.username,
        buzzedQueue: new Set<string>(),
      })

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
      const isRoomAdmin = room.admin === username

      if (room.connections.has(username))
        return connection.socket.close(4002, "Username already taken")

      console.log(`Connection established {${username}} to {${roomId}}`)

      room.connections.set(username, connection.socket)

      function broadcast(message: any) {
        for (const socket of Array.from(room.connections.values()))
          socket.send(JSON.stringify(message))
      }

      connection.socket.on("message", (buffer) => {
        const message = JSON.parse(buffer.toString()) as any

        switch (message.type) {
          case "buzz":
            if (room.buzzedQueue.has(username)) return
            room.buzzedQueue.add(username)

            broadcast({ type: "queue", queue: Array.from(room.buzzedQueue) })

            setTimeout(() => {
              if (room.buzzedQueue.has(username)) room.buzzedQueue.delete(username)
              broadcast({ type: "queue", queue: Array.from(room.buzzedQueue) })
            }, 10 * 1000)

            break
          case "clear":
            if (!isRoomAdmin) return
            room.buzzedQueue.clear()

            broadcast({ type: "queue", queue: Array.from(room.buzzedQueue) })

            break
          default:
            break
        }
      })

      connection.socket.on("close", () => {
        room.connections.delete(username)
        console.log(`Disconnected {${username}} from {${roomId}}`)

        if (room.connections.size === 0) {
          rooms.delete(roomId)
          console.log(`Room close {${roomId}}`)
        }
      })
    })

    return instance
  },
  { prefix: "/api" }
)

app
  .listen({ port: 8000 })
  .then((url) => console.log(`Server listening on ${url}`))
  .catch((err) => console.error("server crash", err))
