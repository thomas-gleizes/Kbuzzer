import { isMainThread, parentPort, workerData } from "node:worker_threads"

if (isMainThread) throw new Error("This file can only be run as a worker")
if (!parentPort) throw new Error("This file can only be run as a worker")
if (!workerData) throw new Error("This file can only be run as a worker")

const { code, admin } = workerData

async function task() {
  let players = new Set<string>()
  let running = true

  parentPort!.on("message", (message) => {
    console.log(message)

    switch (message.type) {
      case "join":
        players.add(message.username)
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

  while (running) {
    console.log(code, admin, players)

    await new Promise((resolve) => setTimeout(resolve, 4000))
  }
}

task().catch((err) => {
  parentPort!.postMessage({ type: "error", error: err })
  parentPort!.close()
})
