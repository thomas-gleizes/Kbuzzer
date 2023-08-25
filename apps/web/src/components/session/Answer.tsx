import React, { useState } from "react"
import { useEvent, useMount } from "react-use"

import { css } from "styled-system/css"
import { useGlobalContext } from "context/global"
import { ExpireIn } from "components/session/ExpireIn"
import { Button, Card, Input } from "components/ui"

const styles = {
  input: css({
    px: 3,
    py: 1,
  }),
}

export const Answer: Component = () => {
  const { sendMessage, handleSocketMessage, expireAt, players } = useGlobalContext()

  const [value, setValue] = useState("")
  const [prevValue, setPrevValue] = useState("")

  const [statics, setStatics] = useState<{ total: number; you: number | null }>({
    total: 0,
    you: null,
  })

  const handleValid = () => {
    if (value !== "") {
      sendMessage("answer", { answer: value })
      setValue("")
      setPrevValue(value)
    }
  }

  useEvent("keydown", (event) => {
    if (event.key === "Enter") handleValid()
  })

  useMount(() => {
    handleSocketMessage("new-answer", (data: any) => {
      setStatics({ total: data.total, you: data.you })
    })
  })

  return (
    <Card>
      {expireAt && <ExpireIn timestamp={expireAt} />}
      <div className={css({ mt: 2 })}>
        <div className={css({ fontSize: "lg" })}>
          <span className={css({ fontWeight: "semibold" })}>{statics.total}</span> participant(s)
          ont répondue sur {players.length}
        </div>
        {statics.you !== null ? (
          <div className={css({ mt: 2 })}>
            Vous avec répondue: '{prevValue}', Votre position est {statics.you + 1}
          </div>
        ) : (
          <div className={css({ mt: 2 })}>Vous n'avez pas encore répondue</div>
        )}

        <div className={css({ mt: 2 })}>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={styles.input}
          />
          <Button onClick={handleValid}>Validé</Button>
        </div>
      </div>
    </Card>
  )
}
