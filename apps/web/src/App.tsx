import React from "react"
import { Link, Router } from "@reach/router"

import { GlobalContextProvider } from "./context/global"
import { css } from "../styled-system/css"
import Home from "./pages/Home"
import Room from "./pages/Room"

export const App: React.FC = () => {
  return (
    <GlobalContextProvider>
      <header
        className={css({
          h: "12",
          shadow: "xl",
          backgroundGradient: "to-bl",
          gradientFrom: "blue.700",
          gradientTo: "purple.700",
          px: 8,
        })}
      >
        <nav className={css({ display: "flex", alignItems: "center", h: "full" })}>
          <Link className={css({ color: "white", fontSize: "2xl", fontWeight: "bold" })} to="/">
            K'buzzer
          </Link>
        </nav>
      </header>
      <Router>
        <Home path="/" />
        <Room path="/room/:id" />
      </Router>
    </GlobalContextProvider>
  )
}
