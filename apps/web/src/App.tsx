import React from "react"
import { ToastContainer } from "react-toastify"
import { Link, Outlet, Route, Routes } from "react-router-dom"

import { css } from "../styled-system/css"
import { GlobalContextProvider } from "./context/global"
import { Home } from "./pages/Home"
import { Room } from "./pages/Room"
import { NotFound } from "./pages/NotFound"

const styles = {
  header: css({
    h: "12",
    shadow: "xl",
    bgGradient: "to-bl",
    gradientFrom: "blue.700",
    gradientTo: "purple.700",
    px: 8,
  }),
  nav: css({
    display: "flex",
    alignItems: "center",
    h: "full",
  }),
  link: css({ color: "white", fontSize: "2xl", fontWeight: "bold" }),
  main: css({ h: "calc(100vh - 48px)", bg: "gray.200" }),
}

const Layout = () => {
  return (
    <GlobalContextProvider>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link className={styles.link} to="/">
            K'buzzer
          </Link>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </GlobalContextProvider>
  )
}

export const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}
