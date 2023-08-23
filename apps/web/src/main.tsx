import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import { App } from "./App"

import "react-toastify/dist/ReactToastify.css"
import "./styles/panda.css"

const root = document.getElementById("root") as Element

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
