import { isMainThread, parentPort, workerData } from "node:worker_threads"

import { SESSION_CODE_LENGTH, PHASE } from "../utils/constants"

if (isMainThread) throw new Error("This file can only be run as a worker")
if (!parentPort) throw new Error("This file can only be run as a worker")
if (!workerData) throw new Error("This file can only be run as a worker")

const { code, admin } = workerData

async function task() {
  let players: Map<string, number> = new Map<string, number>()
  let running: boolean = true
  let phase = PHASE.INIT

  parentPort!.on("message", (message) => {
    console.log("message from server", message)

    switch (message.type) {
      case "join":
        if (players.size >= SESSION_CODE_LENGTH)
          return parentPort!.postMessage({
            type: "error",
            error: "Session limit reached",
          })

        players.set(message.username, 0)

        parentPort!.postMessage({
          type: "user-list",
          data: Array.from(players.entries()).map(([name, score]) => ({ name, score })),
        })

        break
      case "leave":
        players.delete(message.username)

        if (players.size === 0) {
          running = false
          parentPort!.close()
        }
        break
      default:
        break
    }
  })

  parentPort!.on("close", () => {
    console.log("Worker close")
  })

  while (running) {
    console.log(code, players)

    await new Promise((resolve) => setTimeout(resolve, 4000))
  }
}

task().catch((err) => {
  console.log("WORKER ERROR", err)

  parentPort!.postMessage({ type: "error", error: err })
  parentPort!.close()
})
