import React, { useEffect, useState } from "react"
import { useEvent, useMount } from "react-use"

import { css } from "styled-system/css"
import { useGlobalContext } from "context/global"
import { ExpireIn } from "components/session/ExpireIn"
import { Button, Input, InputGroup } from "components/ui"

const styles = {
  input: css({
    px: 3,
    py: 1,
  }),
}

export const Answer: Component = () => {
  const { sendMessage, handleSocketMessage, expireAt } = useGlobalContext()

  const [value, setValue] = useState("")
  const [statics, setStatics] = useState<{ total: number; you: number | null }>({
    total: 0,
    you: null,
  })

  const handleValid = () => {
    if (value !== "") {
      sendMessage("answer", { answer: value })
      setValue("")
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
    <div>
      {expireAt && <ExpireIn timestamp={expireAt} />}
      <div>
        <div>Réponse: {statics.total}</div>
        {statics.you !== null && <div> Position: {statics.you + 1}</div>}

        <InputGroup>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={styles.input}
          />
          <Button onClick={handleValid}>Validé</Button>
        </InputGroup>
      </div>
    </div>
  )
}
