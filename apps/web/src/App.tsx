import React from "react"
import { ToastContainer } from "react-toastify"
import { Route, Routes } from "react-router-dom"

import { Home } from "pages/Home"
import { Session } from "pages/Session"
import { NotFound } from "pages/NotFound"
import { Layout } from "components/common/Layout"

export const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/room/:id" element={<Session />} />
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
