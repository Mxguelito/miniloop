// backend/src/config/db.js
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then(() => console.log("🟢 Conectado a PostgreSQL (Render)"))
  .catch(err => console.error("🔴 Error al conectar a PostgreSQL:", err));
