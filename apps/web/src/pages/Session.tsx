import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { PHASE } from "@kbuzzer/common"
import { Container, Stack } from "styled-system/jsx"
import { useGlobalContext } from "context/global"
import { PlayerList } from "components/session/PlayerList"
import { Parameters } from "components/session/Parameters"
import { Answer } from "components/session/Answer"
import { ValidateAdmin } from "components/session/ValidateAdmin"
import { Result } from "components/session/Result"
import { DisplayerAnswers } from "components/session/DisplayerAnswers"
import { css } from "../../styled-system/css"
import { Waiting } from "components/session/Waiting"

export const Session: Component = () => {
  const { status, username, phase, isAdmin, connect, disconnect, sendMessage } = useGlobalContext()

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id && username && status === WebSocket.CLOSED) {
      connect(id, username)
    } else if (id && !username) {
      navigate(`/?code=${id}`)
    }
  }, [])

  if (status === WebSocket.CONNECTING) return <div>En cours de connection</div>
  if (status === WebSocket.CLOSED || status === WebSocket.CLOSING) return <div> Disconnected </div>

  return (
    <div className={css({ display: "flex", alignItems: "center", h: "full" })}>
      <Stack gap={10}>
        <PlayerList />
        {isAdmin && <Parameters />}
      </Stack>
      <Container>
        {phase === PHASE.INIT && <Waiting />}
        {phase === PHASE.ANSWER && <Answer />}
        {phase === PHASE.VALIDATE && (isAdmin ? <ValidateAdmin /> : <DisplayerAnswers />)}
        {phase === PHASE.RESULT && <Result />}
      </Container>
    </div>
  )
}
