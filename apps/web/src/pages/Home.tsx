import { RouteComponentProps } from "@reach/router"
import { css } from "../../styled-system/css"

import { FormCreateRoom } from "../components/FormCreateRoom"
import { FormJoinRoom } from "../components/FormJoinRoom"

export const Home = () => {
  return (
    <div
      className={css({
        display: "flex",
        flexDir: { base: "column", lg: "row" },
        justifyContent: "space-around",
        alignItems: "center",
        h: "full",
        py: 10,
        bg: "gray.200",
      })}
    >
      <div
        className={css({
          p: 5,
          bg: "gray.100",
          maxW: "80%",
        })}
      >
        <FormCreateRoom />
      </div>
      <div className={css({ p: 5, bg: "gray.100", mt: 5 })}>
        <FormJoinRoom />
      </div>
    </div>
  )
}

export default (props: RouteComponentProps) => <Home />
