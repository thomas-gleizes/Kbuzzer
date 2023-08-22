import React, { createContext, useContext, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useMount } from "react-use"

import { PHASE, Player } from "@Kbuzzer/common"

const GlobalContext = createContext<{
  isAdmin: boolean
  connect: (roomId: string, username: string) => void
  disconnect: () => void
  sendMessage: (type: string, data: object) => void
  handleSocketMessage: (type: string, cb: (data: object) => void) => void
  status: number
  admin: string | undefined
  username: string | null
  players: Player[]
  phase: keyof typeof PHASE | undefined
  expireAt: number | null
  answers: Array<{ name: string; answer: string }> | null
}>({} as any)

export const useGlobalContext = () => useContext(GlobalContext)

function getWsUrl() {
  if (document.location.protocol.includes("https")) return `wss://${document.location.host}/api`
  return `ws://localhost:8000/api`
}

export const GlobalContextProvider: ComponentWithChildren = ({ children }) => {
  const socketRef = useRef<WebSocket>()
  const navigate = useNavigate()

  const [status, setStatus] = useState<number>(WebSocket.CLOSED)
  const [players, setPlayers] = useState<Player[]>([])
  const [admin, setAdmin] = useState<string>()
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem("username"))
  const [phase, setPhase] = useState<keyof typeof PHASE>()

  const [expireAt, setExpireAt] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Array<{ name: string; answer: string }> | null>(null)

  const listenersRef = useRef<Map<string, (data: any) => void>>(new Map())

  const connect = (roomId: string, username: string) => {
    const baseWSUrl = getWsUrl()
    const ws = new WebSocket(`${baseWSUrl}/room/${roomId}?username=${username}`)

    console.log("connection")

    setStatus(ws.readyState)

    ws.addEventListener("open", () => {
      setUsername(username)
      localStorage.setItem("username", username)
      console.log("Connection up")

      setStatus(ws.readyState)
      navigate(`/room/${roomId}`)

      ws.addEventListener("message", (event) => {
        setStatus(ws.readyState)

        const message = JSON.parse(event.data)

        if (listenersRef.current.has(message.type))
          listenersRef.current.get(message.type)!(message.data)
      })
    })

    ws.addEventListener("close", (event: CloseEvent) => {
      console.log("Event", event)

      if (event.code >= 4000) {
        console.log("Event.reason", event.reason)
        toast.error(`${event.code}: ${event.reason}`)
      }
      setStatus(ws.readyState)
    })

    socketRef.current = ws
  }

  const disconnect = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close()
    }
  }

  const sendMessage = (type: string, data: object) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, data }))
    }
  }

  const handleSocketMessage = (type: string, callback: (data: any) => void) => {
    listenersRef.current.set(type, callback)
  }

  useMount(() => {
    handleSocketMessage("change-phase", (data) => {
      setPhase(data.phase)

      switch (data.phase) {
        case PHASE.ANSWER:
          setExpireAt(Date.now() + data.timeLimit * 1000)
          break
        case PHASE.RESULT:
          break
        case PHASE.VALIDATE:
          setExpireAt(null)
          setAnswers(data.answers)
      }
    })

    handleSocketMessage("player-list", (data) => {
      console.log("Data", data)

      setPlayers(data)
    })

    handleSocketMessage("info", (data) => {
      setPhase(data.phase)
      setAdmin(data.admin)
    })
  })

  console.log("Answers", answers)

  return (
    <GlobalContext.Provider
      value={{
        isAdmin: username === admin,
        connect,
        disconnect,
        sendMessage,
        handleSocketMessage,
        status,
        players,
        username,
        admin,
        phase,
        expireAt,
        answers,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
