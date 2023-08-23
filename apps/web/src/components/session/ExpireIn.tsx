import React, { useEffect, useState } from "react"

import { css } from "styled-system/css"

const styles = {
  progressBarContainer: css({
    display: "flex",
    justifyContent: "center",
    bg: "gray.300",
    h: 2,
    rounded: "xl",
    width: "full",
  }),
  progressBar: css({
    h: "full",
    rounded: "xl",
    transitionDuration: "10ms",
    bgGradient: "to-r",
    gradientFrom: "purple.600",
    gradientVia: "red.500",
    gradientTo: "purple.600",
  }),
}

export const ExpireIn: React.FC<{ timestamp: number }> = ({ timestamp }) => {
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
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
    </div>
  )
}
