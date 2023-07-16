import axios from "redaxios"

export const api = axios.create({
  baseURL: "/api",
})
