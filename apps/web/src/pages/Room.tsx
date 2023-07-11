import { Navigate, useParams } from "react-router-dom"

import { css } from "../../styled-system/css"
import { useGlobalContext } from "../context/global"
import React, { useEffect, useState } from "react"

const ExpireIn: React.FC<{ timestamp: number }> = ({ timestamp }) => {
  const [progress, setProgress] = useState<number>(0)
  const [initialTimestamp] = useState<number>(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()

      const diff = timestamp - now

      if (diff < 0) return clearInterval(interval)

      const initialDiff = timestamp - initialTimestamp

      setProgress((diff / initialDiff) * 100)
    }, 10)

    return () => clearInterval(interval)
  }, [timestamp])

  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "end",
        bg: "gray.300",
        h: 2,
        rounded: "xl",
        width: "full",
      })}
    >
      <div
        className={css({
          h: "full",
          rounded: "xl",
          transitionDuration: "10ms",
          bgGradient: "to-r",
          gradientFrom: "purple.700",
          gradientTo: "red.700",
        })}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export const Room = () => {
  const { status, active, users, sendMessage } = useGlobalContext()

  const { id } = useParams()

  if (status !== WebSocket.OPEN) return <Navigate to="/" />

  return (
    <div className={css({ p: 10 })}>
      {status === WebSocket.OPEN ? "Connected" : "Unconnected"}

      <div>
        <h1>Bienvenue dans la session</h1>
        <p>Code de session : {id}</p>
      </div>

      <div>
        <h2>Liste des participants</h2>
        <div>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h2>Buzz : {active !== null ? active.username : "Personne"}</h2>
        {active?.expireAt && <ExpireIn timestamp={active.expireAt} />}
      </div>
      <div>
        <button
          onClick={() => sendMessage({ type: "buzz" })}
          disabled={active !== null}
          className={css({
            backgroundGradient: "to-bl",
            gradientFrom: "purple.700",
            gradientTo: "blue.700",
            color: "white",
            fontSize: "xl",
            rounded: "lg",
            shadow: "lg",
            w: "full",
            py: 1,
            my: 2,
            cursor: "pointer",
            transitionDuration: "100ms",
            _hover: {
              shadow: "xl",
            },
          })}
        >
          Buzz
        </button>
      </div>
      <div>
        <button
          onClick={() => sendMessage({ type: "clear" })}
          disabled={active === null}
          className={css({
            backgroundGradient: "to-bl",
            gradientFrom: "purple.700",
            gradientTo: "blue.700",
            color: "white",
            fontSize: "xl",
            rounded: "lg",
            shadow: "lg",
            w: "full",
            py: 1,
            my: 2,
            cursor: "pointer",
            transitionDuration: "100ms",
            _hover: {
              shadow: "xl",
            },
          })}
        >
          Clear
        </button>
      </div>
    </div>
  )
}
