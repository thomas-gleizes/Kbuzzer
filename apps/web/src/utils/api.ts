import axios from "redaxios"

export const api = axios.create({
  baseURL: "http://localhost:3030/api",
})
