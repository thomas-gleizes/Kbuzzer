import { css } from "../../styled-system/css"

import { FormCreateRoom } from "../components/FormCreateRoom"
import { FormJoinRoom } from "../components/FormJoinRoom"

export const Home = () => {
  return (
    <div
      className={css({
        display: "flex",
        flexDir: { base: "column", md: "row" },
        justifyContent: "space-evenly",
        alignItems: "center",
        h: "full",
        py: 10,
      })}
    >
      <div
        className={css({
          mt: 5,
          w: "350px",
          p: 5,
          backgroundGradient: "to-br",
          gradientFrom: "gray.50",
          gradientTo: "stone.50",
          rounded: "md",
          shadow: "md",
        })}
      >
        <FormCreateRoom />
      </div>
      <div
        className={css({
          mt: 5,
          w: "350px",
          p: 5,
          backgroundGradient: "to-br",
          gradientFrom: "gray.50",
          gradientTo: "stone.50",
          rounded: "md",
          shadow: "md",
        })}
      >
        <FormJoinRoom />
      </div>
    </div>
  )
}
