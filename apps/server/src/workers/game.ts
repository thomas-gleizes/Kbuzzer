import { isMainThread, parentPort, workerData } from "node:worker_threads"

import { SESSION_CODE_LENGTH, PHASE } from "../utils/constants"

if (isMainThread) throw new Error("This file can only be run as a worker")
if (!parentPort) throw new Error("This file can only be run as a worker")
if (!workerData) throw new Error("This file can only be run as a worker")

const { code, admin } = workerData

type Player = {
  name: string
  score: number
  connected: boolean
}

function sendPlayer(players: IterableIterator<Player>) {
  parentPort!.postMessage({
    type: "player-list",
    data: Array.from(players),
  })
}

async function task() {
  const players: Map<string, Player> = new Map()
  let running: boolean = true,
    phase = PHASE.INIT

  console.log("players", players)

  console.log("parentPort", parentPort)

  parentPort?.addListener("message", (message) => {
    console.log("event", message)
  })

  parentPort!.on("message", (message) => {
    console.log("message from server", message)

    switch (message.type) {
      case "join":
        if (players.size >= SESSION_CODE_LENGTH)
          return parentPort!.postMessage({
            type: "error",
            error: "Session limit reached",
          })

        if (players.has(message.username)) players.get(message.username)!.connected = true
        else players.set(message.username, { name: message.username, score: 0, connected: true })

        sendPlayer(players.values())
        break
      case "leave":
        players.delete(message.username)

        if (players.size === 0) {
          running = false
          parentPort!.close()
        } else sendPlayer(players.values())
        break
      default:
        break
    }
  })

  parentPort!.on("close", () => {
    console.log("Worker close")
  })

  while (running) {}
}

task().catch((err) => {
  console.log("WORKER ERROR", err)

  parentPort!.postMessage({ type: "error", error: err })
  parentPort!.close()
})
