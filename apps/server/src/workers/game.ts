import { isMainThread, parentPort, workerData } from "node:worker_threads"

import { Parameters, Player, PHASE } from "@Kbuzzer/common"

if (isMainThread) throw new Error("This file can only be run as a worker")
if (!parentPort) throw new Error("This file can only be run as a worker")
if (!workerData) throw new Error("This file can only be run as a worker")

const parent = parentPort
const { code, admin, initialParameters } = workerData

function sendPlayer(players: IterableIterator<Player>) {
  parent.postMessage({
    type: "player-list",
    data: Array.from(players),
  })
}

async function task() {
  const players: Map<string, Player> = new Map()
  let phase: keyof typeof PHASE = PHASE.INIT

  let parameters: Parameters = { ...initialParameters }

  let answers: Map<string, string>

  parent.on("message", (message) => {
    const { type, username, data } = message

    switch (message.type) {
      case "join":
        if (phase === PHASE.FINISH) break

        if (players.has(message.username)) players.get(message.username)!.connected = true
        else players.set(message.username, { name: message.username, score: 0, connected: true })

        sendPlayer(players.values())
        break
      case "leave":
        if (players.has(message.username)) players.get(message.username)!.connected = false

        if (Array.from(players.values()).every((player) => !player.connected)) {
          parent.close()
        } else sendPlayer(players.values())

        break
      case "start-game":
        if (!(phase === PHASE.INIT || PHASE.RESULT) && username === admin) {
          break
        }

        answers = new Map()

        phase = PHASE.ANSWER
        parent.postMessage({
          type: "change-phase",
          data: { phase, timeLimit: parameters.timeLimit },
        })

        console.log("Timeout", parameters.timeLimit)

        setTimeout(() => {
          if (answers.size === 0) {
            phase = PHASE.RESULT

            parent.postMessage({
              type: "change-phase",
              data: { phase, noAnswers: true },
            })
          } else {
            phase = PHASE.VALIDATE

            parent.postMessage({
              type: "change-phase",
              data: {
                phase,
                answers: Array.from(answers.entries()).map(([name, answer]) => ({ name, answer })),
              },
            })
          }
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
            data: {
              player: data.name,
              answer: answers.get(data.name)!,
            },
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
        if (phase === PHASE.FINISH) break

        const { timeLimit } = message.data

        parameters = {
          ...parameters,
          timeLimit,
        }

        console.log("New paremeters", parameters)

        parent.postMessage({ type: "update-parameters", data: { parameters } })

        break
      }
      default:
        break
    }
  })
}

task().catch((err) => {
  console.log("WORKER ERROR", err)

  parent.postMessage({ type: "error", error: err })
  parent.close()
})
