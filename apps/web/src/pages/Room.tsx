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
        justifyContent: "center",
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
  const { status, active, users, ban, admin, username, sendMessage } = useGlobalContext()

  const { id } = useParams()

  if (status !== WebSocket.OPEN) return <Navigate to="/" />

  return (
    <div className={css({ p: 10, maxW: "500px", m: "auto" })}>
      <div>
        <h1 className={css({ fontSize: "xl" })}>Bienvenue dans la session</h1>
        <p className={css({ fontSize: "2xl" })}>
          Code de session :{" "}
          <span
            className={css({
              fontWeight: "bold",
              color: "transparent",
              backgroundGradient: "to-r",
              gradientFrom: "purple.800",
              gradientTo: "blue.800",
              bgClip: "text",
            })}
          >
            {id}
          </span>
        </p>
      </div>

      <div
        className={css({
          p: 5,
          shadow: "xl",
          borderColor: "purple.700",
          borderWidth: 1,
          rounded: "lg",
        })}
      >
        <h2
          className={css({
            textAlign: "center",
            fontSize: "xl",
            fontWeight: "bold",
            color: "transparent",
            backgroundGradient: "to-r",
            gradientFrom: "purple.800",
            gradientTo: "blue.800",
            bgClip: "text",
          })}
        >
          Liste des participants ({users.length})
        </h2>
        <div className={css({ display: "flex", flexDir: "column" })}>
          {users.map((user, index) => (
            <div key={index} className={css({ mt: 1 })}>
              {user} {user === username && "(vous)"} {admin === user && "(admin)"}
            </div>
          ))}
        </div>
      </div>
      <div className={css({ my: 2 })}>
        {active && (
          <div>
            <h2
              className={css({
                textAlign: "center",
                fontSize: "xl",
                fontWeight: "bold",
                color: "transparent",
                backgroundGradient: "to-r",
                gradientFrom: "purple.800",
                gradientTo: "blue.800",
                bgClip: "text",
              })}
            >
              {active.username}
            </h2>
            <ExpireIn timestamp={active.expireAt} />
          </div>
        )}
      </div>
      <div>
        <button
          onClick={() => sendMessage({ type: "buzz" })}
          disabled={active !== null || typeof ban === "number"}
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
            _disabled: {
              backgroundColor: "gray.500",
              opacity: 0.5,
            },
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
