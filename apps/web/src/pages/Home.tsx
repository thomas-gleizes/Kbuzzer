import React from "react"

import { css } from "styled-system/css"
import { Card } from "components/ui"
import { FormCreateRoom } from "components/forms/FormCreateRoom"
import { FormJoinRoom } from "components/forms/FormJoinRoom"

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
}

export const Home: Component = () => {
  return (
    <div className={styles.container}>
      <Card>
        <FormCreateRoom />
      </Card>
      <Card>
        <FormJoinRoom />
      </Card>
    </div>
  )
}
