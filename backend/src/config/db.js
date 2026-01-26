import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

let pool;

if (process.env.DATABASE_URL) {
  // Render / Producción
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  console.log("🌍 Usando DATABASE_URL (Render)");
} else {
  // Localhost
  pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
  });

  console.log("💻 Usando PostgreSQL local");
}

export { pool };
