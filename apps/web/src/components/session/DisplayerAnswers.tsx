import React, { useState } from "react"
import { useMount } from "react-use"

import { useGlobalContext } from "context/global"

export const DisplayerAnswers: Component = () => {
  const { admin, answers, handleSocketMessage } = useGlobalContext()

  const [index, setIndex] = useState(0)

  const current = Array.isArray(answers) ? answers.at(index) : null

  useMount(() => {
    handleSocketMessage("skip", () => {
      setIndex((prevState) => prevState + 1)
    })
  })

  return (
    <div>
      <div>En attende de validation de la réponse par le créateur de la session : {admin}</div>

      {current && (
        <div>
          <span>{current.name}</span> à répondue <span> {current.answer}</span>
        </div>
      )}
    </div>
  )
}
