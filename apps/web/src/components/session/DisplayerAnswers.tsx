import React, { useState } from "react"
import { useMount } from "react-use"

import { useGlobalContext } from "context/global"
import { Card } from "components/ui"
import { css } from "styled-system/css"

export const DisplayerAnswers: Component = () => {
  const { admin, answers, handleSocketMessage } = useGlobalContext()

  const [index, setIndex] = useState(0)

  const current = Array.isArray(answers) ? answers.at(index) : null

  useMount(() => {
    handleSocketMessage("skip-answer", () => {
      console.log("RECEIVED SKIP")

      setIndex((prevState) => prevState + 1)
    })
  })

  return (
    <Card>
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
    </Card>
  )
}
