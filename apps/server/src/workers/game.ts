import { isMainThread, parentPort, workerData } from "node:worker_threads"

import { SESSION_PLAYER_LIMIT, PHASE } from "../utils/constants"
import { Parameters, Player } from "../types"

if (isMainThread) throw new Error("This file can only be run as a worker")
if (!parentPort) throw new Error("This file can only be run as a worker")
if (!workerData) throw new Error("This file can only be run as a worker")

const parent = parentPort
const { code, admin } = workerData

function sendPlayer(players: IterableIterator<Player>) {
  console.log("SendPlayer()")

  parent.postMessage({
    type: "player-list",
    data: Array.from(players),
  })
}

async function task() {
  const players: Map<string, Player> = new Map()
  let phase: keyof typeof PHASE = PHASE.INIT

  let parameters: Parameters = {
    timeLimit: 20,
  }

  let answers: Map<string, string>

  console.log("worker created", code, admin)

  parentPort!.on("message", (message) => {
    const { type, username, data } = message
    console.log("message from server", type, username, data)

    switch (message.type) {
      case "join":
        if (phase === PHASE.FINISH) break

        if (players.has(message.username)) players.get(message.username)!.connected = true
        else players.set(message.username, { name: message.username, score: 0, connected: true })

        sendPlayer(players.values())
        break
      case "leave":
        players.delete(message.username)

        if (players.size === 0) {
          parent.close()
        } else sendPlayer(players.values())

        break
      case "start-game":
        console.log("Phase", phase)
        if (!(phase === PHASE.INIT || PHASE.RESULT) && username === admin) {
          console.log("Break")
          break
        }

        answers = new Map()

        phase = PHASE.ANSWER
        parent.postMessage({
          type: "change-phase",
          data: { phase, timeLimit: parameters.timeLimit },
        })

        console.log("Parameters.timeLimit", parameters.timeLimit)

        setTimeout(() => {
          phase = PHASE.VALIDATE

          console.log(
            "réponse",
            Array.from(answers.entries()).map(([name, answer]) => ({ name, answer }))
          )

          parent.postMessage({
            type: "change-phase",
            data: {
              phase,
              answers: Array.from(answers.entries()).map(([name, answer]) => ({ name, answer })),
            },
          })
        }, parameters.timeLimit * 1000)
        break
      case "answer": {
        if (phase !== PHASE.ANSWER) break

        if (answers.has(username)) answers.delete(username)

        answers.set(username, data.answer)

        parent.postMessage({
          type: "new-answer",
          data: {
            answers: Array.from(answers.entries()).map(([name, answer]) => ({ name, answer })),
          },
        })

        break
      }
      case "validate": {
        if (phase !== PHASE.VALIDATE || username !== admin) break

        if (players.has(data.name)) {
          players.get(data.name)!.score += 1

          parent.postMessage({
            type: "correct-answer",
            data: { player: data.name, answer: answers.get(data.name)! },
          })
        } else {
          parent.postMessage({
            type: "no-correct-answer",
            data: {},
          })
        }

        phase = PHASE.RESULT

        parent.postMessage({
          type: "change-phase",
          data: { phase, players: Array.from(players.values()) },
        })

        break
      }
      case "change-parameters": {
        if (phase !== PHASE.INIT) break

        const { timeLimit } = message.data

        parameters = {
          ...parameters,
          timeLimit,
        }

        break
      }
      default:
        break
    }
  })

  parent.on("close", () => {
    console.log("Worker close")
  })

  let running = true

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
}

task().catch((err) => {
  console.log("WORKER ERROR", err)

  parent.postMessage({ type: "error", error: err })
  parent.close()
})
