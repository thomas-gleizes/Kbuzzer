import React from "react"
import { BeatLoader } from "react-spinners"

import { Center } from "styled-system/jsx"
import { css } from "styled-system/css"
import { Button, Card } from "components/ui"
import { useGlobalContext } from "context/global"

export const Waiting: Component = () => {
  const { isAdmin, sendMessage } = useGlobalContext()

  const handleStart = () => {
    sendMessage("start-game", {})
  }

  return (
    <Card>
      <Center className={css({ mb: "5" })}>
        <h1 className={css({ fontSize: "xl" })}>En attente de lancement de la partie</h1>
      </Center>
      <Center className={css({ mb: "5" })}>
        <BeatLoader color="purple" />
      </Center>
      {isAdmin && (
        <Center>
          <Button onClick={handleStart}>C'est parti</Button>
        </Center>
      )}
    </Card>
  )
}
