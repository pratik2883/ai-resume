import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./db/migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ai-resume",
    port: parseInt(process.env.DB_PORT || "3306", 10)
  }
});