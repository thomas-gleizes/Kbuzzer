import React, { useEffect, useMemo, useRef, useState } from "react"

import { useGlobalContext } from "context/global"
import { Button, Card } from "components/ui"
import { Center, Container } from "../../../styled-system/jsx"
import { css } from "../../../styled-system/css"
import { BeatLoader } from "react-spinners"
import { ExpireIn } from "components/session/ExpireIn"

const DateFromNow: Component<{ timestamp: number }> = ({ timestamp }) => {
  const initTimestamp = useMemo(() => timestamp, [])

  const [value, setValue] = useState(initTimestamp - Date.now())

  useEffect(() => {
    const interval = setInterval(() => setValue(initTimestamp - Date.now()), 500)

    return () => clearInterval(interval)
  }, [])

  return Math.max(value / 1000, 0).toFixed(0)
}

export const Result: Component = () => {
  const { prevAnswer, username, answers, isAdmin, parameters, sendMessage } = useGlobalContext()

  const timestamp = useMemo(() => Date.now(), [])

  if (!prevAnswer) return null

  const handleStart = () => {
    sendMessage("start-game", {})
  }

  const otherAnswer = answers
    ? answers.filter(
        (a) =>
          !prevAnswer ||
          !prevAnswer.success ||
          (prevAnswer.success && a.name !== prevAnswer.player),
      )
    : []

  const [timeout, setTimeout] = useState<number | null>(null)

  useEffect(() => {
    if (isAdmin) {
      const timeout = window.setTimeout(() => handleStart(), parameters.timeLimit * 1000 + 1000)

      setTimeout(timeout)

      return () => {
        handleClearTimeout()
      }
    }
  }, [])

  const handleClearTimeout = () => {
    if (typeof timeout === "number" && isAdmin) {
      clearInterval(timeout)
      setTimeout(null)
    }
  }

  return (
    <Card className={css({ w: "500px" })}>
      <h2 className={css({ textAlign: "center", fontWeight: "semibold", fontSize: "2xl" })}>
        {prevAnswer.success ? (
          <span>
            La réponse validé est '{prevAnswer.answer}' par{" "}
            {prevAnswer.player === username ? "Vous" : prevAnswer.player}
          </span>
        ) : prevAnswer.noAnswers ? (
          <span>Aucune réponse donnée</span>
        ) : (
          <span>Aucune bonne réponse</span>
        )}
      </h2>

      {Array.isArray(answers) && otherAnswer.length ? (
        <div className={css({ my: 5, p: 5, border: "1px dashed black", borderRadius: "lg" })}>
          <h3 className={css({ textAlign: "center", fontSize: "2xl" })}>Les autres</h3>
          <ul className={css({ display: "flex", flexDir: "column" })}>
            {otherAnswer.map((answer, index) => (
              <li key={index} className={css({ mt: "2" })}>
                <span className={css({ fontWeight: "semibold" })}>{answer.name}</span> à répondue '
                <span className={css({ fontWeight: "semibold" })}>{answer.answer}</span>'{" "}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Center className={css({ mb: "5" })}>
        <h1 className={css({ fontSize: "xl" })}>En attente d'une nouvelle manche</h1>
      </Center>
      <Center className={css({ mb: "5" })}>
        <BeatLoader color="purple" />
      </Center>
      {timeout && (
        <div>
          <p>
            Lancement automatique dans{" "}
            <DateFromNow timestamp={timestamp + parameters.timeLimit * 1000} /> seconde(s)
          </p>
          <ExpireIn timestamp={timestamp + parameters.timeLimit * 1000} />
        </div>
      )}
      {isAdmin && (
        <Center
          className={css({ mt: "5", display: "flex", justifyContent: "space-evenly", w: "full" })}
        >
          <Button onClick={handleStart}>C'est reparti</Button>
          <Button visual="outline" onClick={handleClearTimeout}>
            Pause
          </Button>
        </Center>
      )}
    </Card>
  )
}
