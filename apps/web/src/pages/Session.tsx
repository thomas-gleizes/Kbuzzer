import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { PHASE } from "@Kbuzzer/common"
import { useGlobalContext } from "context/global"
import { PlayerList } from "components/session/PlayerList"
import { Parameters } from "components/session/Parameters"
import { Answer } from "components/session/Answer"
import { Button } from "components/ui"
import { ValidateAdmin } from "components/session/ValidateAdmin"
import { Result } from "components/session/Result"
import { DisplayerAnswers } from "components/session/DisplayerAnswers"

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

  const handleDisconnect = () => {
    disconnect()
    navigate("/")
  }

  const handleStart = () => {
    sendMessage("start-game", {})
  }

  if (status === WebSocket.CONNECTING) return <div>En cours de connection</div>
  if (status === WebSocket.CLOSED || status === WebSocket.CLOSING) return <div> Disconnected </div>

  return (
    <div>
      {phase}
      <PlayerList />

      <div>
        {isAdmin && (phase === PHASE.INIT || phase === PHASE.RESULT) ? (
          <>
            <Parameters />
            <Button onClick={handleStart}>
              {phase === PHASE.INIT ? "Commencé" : "Prochain round"}
            </Button>
          </>
        ) : null}

        {phase === PHASE.ANSWER && <Answer />}
        {phase === PHASE.VALIDATE && (isAdmin ? <ValidateAdmin /> : <DisplayerAnswers />)}
        {phase === PHASE.RESULT && <Result />}

        <Button onClick={handleDisconnect} visual="outline">
          Disconnect
        </Button>
      </div>
    </div>
  )
}
