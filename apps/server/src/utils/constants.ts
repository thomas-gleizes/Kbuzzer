import path from "node:path"
import dotenv from "dotenv"

dotenv.config({ path: "./.env" })

export const APP_PORT = +(process.env.APP_PORT as string) || 8000
export const SESSION_LIMIT = +(process.env.SESSION_LIMIT as string) || 5
export const SESSION_PLAYER_LIMIT = +(process.env.SESSION_CODE_LENGTH as string) || 10

export const WORKERS_DIRECTORY = path.join(__dirname, "workers")
