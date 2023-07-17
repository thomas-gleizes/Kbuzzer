import { WebSocket } from "ws"

declare type Room = {
  connections: Map<string, WebSocket>
  admin: string
  buzzed: string | null
  banBuzzed: string | null
  delay: number
  lastActivity: number
}
