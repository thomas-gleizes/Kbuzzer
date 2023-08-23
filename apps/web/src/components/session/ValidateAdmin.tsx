import React, { useState } from "react"

import { useGlobalContext } from "context/global"
import { Button, Card } from "components/ui"
import { css } from "../../../styled-system/css"

export const ValidateAdmin: Component = () => {
  const { isAdmin, answers, username, sendMessage } = useGlobalContext()

  const [index, setIndex] = useState(0)

  const current = Array.isArray(answers) ? answers.at(index) : null

  const handleSkip = () => {
    if (index + 1 < answers!.length) {
      sendMessage("skip-answer", { username: current!.name })
      setIndex(index + 1)
    } else {
      sendMessage("validate-answer", { username: null })
    }
  }

  const handleValidate = () => {
    sendMessage("validate-answer", { username: current!.name })
  }

  if (isAdmin)
    return (
      <Card className={css({ w: "450px" })}>
        <div>
          <h1 className={css({ fontSize: "2xl", mb: 5, textAlign: "center" })}>
            C'est l'heure du jugement
          </h1>
        </div>
        {current && (
          <p className={css({ fontSize: "xl", textAlign: "center" })}>
            <span className={css({ fontWeight: "semibold" })}>{current.name}</span> à répondue '
            <span className={css({ fontWeight: "semibold" })}>{current.answer}</span>'
          </p>
        )}
        <div className={css({ mt: "5", display: "flex", justifyContent: "space-between" })}>
          <Button onClick={handleSkip} type="button" visual="outline">
            Incorrect
          </Button>
          <Button onClick={handleValidate} type="button">
            Correct (+1 point)
          </Button>
        </div>
      </Card>
    )

  return <div></div>
}
