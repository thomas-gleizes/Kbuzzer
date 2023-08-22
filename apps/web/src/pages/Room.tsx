import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { PHASE } from "@Kbuzzer/common"
import { useGlobalContext } from "../context/global"
import { PlayerList } from "../components/rooms/PlayerList"
import { css } from "../../styled-system/css"
import { Parameters } from "../components/rooms/Parameters"
import { Answer } from "../components/rooms/Answer"

const styles = {
  container: css({
    p: 5,
  }),
  btn: css({
    cursor: "pointer",
    backgroundGradient: "to-r",
    gradientFrom: "blue.800",
    gradientTo: "purple.700",
    px: "3",
    py: "2",
    color: "white",
    fontWeight: "semibold",
    borderRadius: "lg",
    shadow: "lg",
  }),
}

export const Room = () => {
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

  const handleDisconnect = () => {
    disconnect()
    navigate("/")
  }

  const handleStart = () => {
    sendMessage("start-game", {})
  }

  return (
    <div className={styles.container}>
      {phase}
      <PlayerList />

      <div>
        {isAdmin && (phase === PHASE.INIT || phase === PHASE.RESULT) ? (
          <>
            <Parameters />
            <button onClick={handleStart} className={styles.btn}>
              Commencé
            </button>
          </>
        ) : null}

        {phase === PHASE.ANSWER && <Answer />}

        <button onClick={handleDisconnect} className={styles.btn}>
          Disconnect
        </button>
      </div>
    </div>
  )
}
