import React, { useEffect } from "react"

import { useGlobalContext } from "context/global"
import { css } from "styled-system/css"

const styles = {
  container: css({
    backgroundGradient: "to-br",
    gradientFrom: "white",
    gradientTo: "gray.100",
    borderRadius: "lg",
    w: "fit",
    p: 3,
  }),
  h1: css({
    fontWeight: "semibold",
    fontSize: "2xl",
  }),
  list: css({
    display: "flex",
    flexDir: "column",
  }),
  item: css({
    fontSize: "xl",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }),
  admin: {
    color: "red.500",
  },
  player: {
    fontWeight: "bold",
  },
}

export const PlayerList: Component = () => {
  const { players, admin, username } = useGlobalContext()

  useEffect(() => console.log("Players", players), [players])

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.h1}>Liste des participants</h1>
      </div>
      <div className={styles.list}>
        {players.map((player, index) => (
          <div
            key={index}
            className={styles.item}
            style={{
              fontWeight: player.name === username ? "bold" : "normal",
              color: player.name === admin ? "red" : "black",
            }}
          >
            <span>{player.name}</span>
            <span>{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
