import React from "react"

import { useGlobalContext } from "context/global"
import { Button, Card } from "components/ui"

export const Result: Component = () => {
  const { prevAnswer, username, isAdmin } = useGlobalContext()

  if (!prevAnswer) return null

  if (prevAnswer.success) {
    return (
      <Card>
        La réponse validé est '{prevAnswer.answer}' par{" "}
        {prevAnswer.player === username ? "Vous" : prevAnswer.player}
      </Card>
    )
  }

  return (
    <Card>
      <div>Aucune bonne réponse</div>
    </Card>
  )
}
