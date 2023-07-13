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
          gradientFrom: "purple.600",
          gradientVia: "red.500",
          gradientTo: "purple.600",
        })}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export const Room = () => {
  const { status, active, users, ban, admin, username, sendMessage, disconnect } =
    useGlobalContext()

  const { id } = useParams()

  if (status !== WebSocket.OPEN) return <Navigate to="/" />

  useEffect(() => {
    return () => disconnect()
  }, [])

  return (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        maxW: "500px",
        p: 10,
        m: "auto",
        h: "full",
      })}
    >
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
          borderWidth: 2,
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
            mb: 4,
          })}
        >
          Liste des participants ({users.length})
        </h2>
        <div className={css({ display: "flex", flexDir: "column" })}>
          {users.map((user, index) => (
            <div key={index} className={css({ mt: 1 })}>
              {user === username && "(V)"} {admin === user && "(A)"}{" "}
              <span className={css({ color: "purple.700", fontWeight: "semibold" })}>{user}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={css({ my: 5, h: "20" })}>
        {active && (
          <div>
            <h2
              className={css({
                textAlign: "center",
                fontSize: "3xl",
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
      <div
        className={css({
          h: "full",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDir: "column",
          my: "10",
        })}
      >
        <button
          onClick={() => sendMessage({ type: "buzz" })}
          disabled={active !== null || typeof ban === "number"}
          className={css({
            backgroundGradient: "to-bl",
            gradientFrom: "purple.700",
            gradientTo: "blue.700",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "5xl",
            fontWeight: "semibold",
            shadow: "lg",
            w: "250px",
            h: "250px",
            rounded: "full",
            cursor: "pointer",
            transitionDuration: "100ms",
            _hover: {
              shadow: "xl",
              scale: active !== null || typeof ban === "number" ? "1" : "1.1",
            },
            _disabled: {
              backgroundColor: "gray.500",
              opacity: 0.5,
              scale: "1",
            },
          })}
        >
          Buzz
        </button>
        {admin === username && (
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
              my: 2,
              py: 4,
              px: 10,
              cursor: "pointer",
              fontWeight: "bold",
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
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
