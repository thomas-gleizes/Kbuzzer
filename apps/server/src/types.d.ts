import { WebSocket } from "ws"
import { Worker } from "node:worker_threads"

declare type Room = {
  code: string
  connections: Map<string, WebSocket>
  admin: string
  worker: Worker
}
