import { WebSocket } from "ws"
import { Worker } from "node:worker_threads"

export const PHASE = {
  INIT: "INIT",
  ANSWER: "ANSWER",
  VALIDATE: "VALIDATE",
  RESULT: "RESULT",
  PAUSE: "PAUSE",
  FINISH: "FINISH",
} as const

export type Room = {
  code: string
  connections: Map<string, WebSocket>
  admin: string
  worker: Worker
}

export type Player = {
  name: string
  score: number
  connected: boolean
}

export type Parameters = {
  timeLimit: number
}
