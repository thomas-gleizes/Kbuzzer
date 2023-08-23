import React, { useEffect, useMemo } from "react"

import { useGlobalContext } from "context/global"
import { css } from "styled-system/css"
import { Card } from "components/ui"

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
    textAlign: "center",
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

  const orderedPlayers = useMemo(() => {
    return players.sort((a, b) => a.score - b.score).sort((a) => (a.connected ? -1 : 1))
  }, [players])

  return (
    <Card className={css({ w: "400px" })}>
      <div>
        <h1 className={styles.h1}>Liste des participants</h1>
      </div>
      <div className={styles.list}>
        {orderedPlayers.map((player, index) => (
          <div
            key={index}
            className={styles.item}
            style={{
              fontWeight: player.name === username ? "bold" : "normal",
              color: player.name === admin ? "red" : "black",
              opacity: player.connected ? "100%" : "50%",
            }}
          >
            <span>{player.name}</span>
            <span>{player.score}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
