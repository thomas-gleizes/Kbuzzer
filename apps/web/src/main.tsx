import React from "react"
import ReactDOM from "react-dom/client"

import { App } from "./App"
import "./styles/panda.css"
import "react-toastify/dist/ReactToastify.css"
import { BrowserRouter } from "react-router-dom"

const root = document.getElementById("root") as Element

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
