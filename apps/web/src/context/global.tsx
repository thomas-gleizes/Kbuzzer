import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const GlobalContext = createContext<{
  connect: (roomId: string, username: string) => void
  sendMessage: (message: object) => void
  status: number
  active: { username: string; expireAt: number } | null
  users: string[]
  ban: number | null
  admin: string | undefined
  username: string | undefined
}>({} as any)

export const useGlobalContext = () => useContext(GlobalContext)

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket>()
  const navigate = useNavigate()

  const [status, setStatus] = useState<number>(WebSocket.CLOSED)
  const [users, setUsers] = useState<string[]>([])
  const [active, setActive] = useState<{ username: string; expireAt: number } | null>(null)
  const [ban, setBan] = useState<number | null>(null)
  const [admin, setAdmin] = useState<string>()
  const [username, setUsername] = useState<string>()

  const connect = (roomId: string, username: string) => {
    console.log("Try to connect")

    const ws = new WebSocket(`ws://localhost:8000/api/room/${roomId}?username=${username}`)

    setStatus(ws.readyState)

    ws.addEventListener("open", () => {
      setUsername(username)
      console.log("Connection up")

      setStatus(ws.readyState)
      navigate(`/room/${roomId}`)

      ws.addEventListener("message", (event) => {
        setStatus(ws.readyState)

        const message = JSON.parse(event.data)

        switch (message.type) {
          case "list":
            setAdmin(message.admin)
            return setUsers(message.users)
          case "buzz":
            return setActive({ username: message.username, expireAt: message.expireAt })
          case "clear":
            return setActive(null)
          case "ban":
            setBan(message.unBanAt)

            return setTimeout(() => {
              setBan(null)
            }, message.unBanAt - Date.now())
          default:
            return ""
        }
      })

      ws.addEventListener("close", () => {
        setStatus(ws.readyState)
      })
    })

    socketRef.current = ws
  }

  console.log("Ban", ban)

  const sendMessage = (message: object) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message))
    }
  }

  return (
    <GlobalContext.Provider
      value={{ connect, sendMessage, status, users, active, ban, username, admin }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
