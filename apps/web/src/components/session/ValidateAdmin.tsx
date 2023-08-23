import React, { useState } from "react"

import { useGlobalContext } from "context/global"
import { Button } from "components/ui"

export const ValidateAdmin: Component = () => {
  const { isAdmin, answers, sendMessage } = useGlobalContext()

  const [index, setIndex] = useState(0)

  const current = Array.isArray(answers) ? answers.at(index) : null

  const handleSkip = () => {
    if (index + 1 < answers!.length) {
      sendMessage("skip-anwser", { username: current!.name })
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
      <div>
        {current && (
          <div>
            <span>{current.name}</span> à répondue <span> {current.answer}</span>
          </div>
        )}
        <div>
          <Button onClick={handleSkip} type="button" visual="outline">
            Incorrect
          </Button>
          <Button onClick={handleValidate} type="button">
            Correct (+1 point)
          </Button>
        </div>
      </div>
    )

  return <div></div>
}
