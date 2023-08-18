import { WebSocket } from "ws"

declare type Room = {
  connections: Map<string, WebSocket>
  admin: string
  responses: Map<string, string>
  scores: Map<string, number>
  lastActivity: number
  play: boolean
  interval: NodeJS.Timeout | null
  parameter: {
    time: number
  }
  broadcast: (message: any) => void
}
