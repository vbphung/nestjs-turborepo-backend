import { config } from "dotenv"

config()

export const mongoUri = process.env.MONGO_URI
export const mongoDb = process.env.MONGO_DB
