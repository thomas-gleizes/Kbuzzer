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
  buzzed: string | null
  banBuzzed: string | null
  delay: number
}

app.register(
  async (instance) => {
    let rooms = new Map<string, Room>()

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

      function broadcast(message: any) {
        for (const socket of Array.from(room.connections.values()))
          socket.send(JSON.stringify(message))
      }

      broadcast({ type: "list", users: Array.from(room.connections.keys()), admin: room.admin })

      connection.socket.on("message", (buffer) => {
        const message = JSON.parse(buffer.toString()) as any

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
  .listen({ port: 8000 })
  .then((url) => console.log(`Server listening on ${url}`))
  .catch((err) => console.error("server crash", err))
