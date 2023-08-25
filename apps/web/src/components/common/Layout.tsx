import React from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"

import { css } from "styled-system/css"
import { GlobalContextProvider, useGlobalContext } from "context/global"
import { Button } from "components/ui"

const styles = {
  header: css({
    h: "12",
    shadow: "xl",
    bgGradient: "to-bl",
    gradientFrom: "blue.700",
    gradientTo: "purple.700",
    px: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  nav: css({
    display: "flex",
    alignItems: "center",
    h: "full",
  }),
  link: css({ color: "white", fontSize: "2xl", fontWeight: "bold" }),
  main: css({ h: "calc(100vh - 48px)", bg: "gray.200", p: 5 }),
}

export const Layout: Component = () => {
  return (
    <GlobalContextProvider>
      <Content />
    </GlobalContextProvider>
  )
}

const Content: Component = () => {
  const context = useGlobalContext()
  const navigate = useNavigate()

  const handleDisconnect = () => {
    navigate("/")
    context.disconnect()
  }

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link className={styles.link} to="/">
            K'Blind
          </Link>
        </nav>
        <div>
          {context.status === WebSocket.OPEN && (
            <Button type="button" onClick={handleDisconnect} visual="outline">
              Disconnect
            </Button>
          )}
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  )
}
