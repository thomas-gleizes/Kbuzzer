import { css } from "../../styled-system/css"

import { FormCreateRoom } from "../components/forms/FormCreateRoom"
import { FormJoinRoom } from "../components/forms/FormJoinRoom"

const styles = {
  container: css({
    display: "flex",
    flexDir: { base: "column", md: "row" },
    justifyContent: "space-evenly",
    alignItems: "center",
    h: "full",
    py: 10,
    maxW: "1200px",
    mx: "auto",
  }),
  card: css({
    w: "350px",
    px: 7,
    py: 8,
    backgroundGradient: "to-br",
    gradientFrom: "gray.50",
    gradientTo: "stone.50",
    rounded: "md",
    shadow: "2xl",
    borderWidth: 2,
    borderColor: "purple.700",
  }),
}

export const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <FormCreateRoom />
      </div>
      <div className={styles.card}>
        <FormJoinRoom />
      </div>
    </div>
  )
}
