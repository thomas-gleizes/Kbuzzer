import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useGlobalContext } from "../context/global"

export const Room = () => {
  const { status, username, connect, phase } = useGlobalContext()

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

  return <div></div>
}
