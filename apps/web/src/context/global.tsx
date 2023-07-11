import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const GlobalContext = createContext<{
  connect: (roomId: string, username: string) => void
  sendMessage: (message: object) => void
  status: number
  queue: string[]
  users: string[]
}>({} as any)

export const useGlobalContext = () => useContext(GlobalContext)

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket>()
  const navigate = useNavigate()

  const [statusSocket, setStatusSocket] = useState<number>(WebSocket.CLOSED)
  const [users, setUsers] = useState<string[]>([])
  const [queue, setQueue] = useState<string[]>([])

  const connect = (roomId: string, username: string) => {
    console.log("Try to connect")

    const ws = new WebSocket(`ws://localhost:8000/api/room/${roomId}?username=${username}`)

    setStatusSocket(ws.readyState)

    ws.addEventListener("open", () => {
      console.log("Connection up")

      setStatusSocket(ws.readyState)
      navigate(`/room/${roomId}`)

      ws.addEventListener("message", (event) => {
        setStatusSocket(ws.readyState)

        const message = JSON.parse(event.data)

        console.log("Message", message)

        switch (message.type) {
          case "list":
            return setUsers(message.users)
          case "queue":
            return setQueue(message.queue)
          default:
            return ""
        }
      })

      ws.addEventListener("close", () => {
        setStatusSocket(ws.readyState)

        console.log("Connection close")
      })
    })

    socketRef.current = ws
  }

  const sendMessage = (message: object) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message))
    }
  }

  return (
    <GlobalContext.Provider value={{ connect, sendMessage, status: statusSocket, users, queue }}>
      {children}
    </GlobalContext.Provider>
  )
}
