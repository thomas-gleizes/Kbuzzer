import { useGlobalContext } from "../context/global"
import { Navigate, useParams } from "react-router-dom"
import { css } from "../../styled-system/css"

export const Room = () => {
  const { status, queue, users, sendMessage } = useGlobalContext()

  const { id } = useParams()

  if (status !== WebSocket.OPEN) return <Navigate to="/" />

  return (
    <div>
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
        <h2>Queue</h2>
        <div>
          <ul>
            {queue.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <button
          onClick={() => sendMessage({ type: "buzz" })}
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
              scale: "1.05",
            },
          })}
        >
          Buzz
        </button>
      </div>
      <div>
        <button
          onClick={() => sendMessage({ type: "clear" })}
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
              scale: "1.05",
            },
          })}
        >
          Clear
        </button>
      </div>
    </div>
  )
}
