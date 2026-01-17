// backend/src/config/db.js
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

pool.connect()
  .then(() => console.log("🟢 Conectado a PostgreSQL (Miniloop)"))
  .catch(err => console.error("🔴 Error al conectar a PostgreSQL:", err));
