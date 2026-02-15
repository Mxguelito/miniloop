import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsPath = path.join(__dirname, "../../db/migrations");

export async function runMigrations() {
  try {
    console.log("🔄 Verificando migraciones...");

    // 1️⃣ Asegurar tabla schema_migrations
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 2️⃣ Leer archivos
    const files = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const { rows } = await pool.query(
        "SELECT 1 FROM schema_migrations WHERE filename = $1",
        [file]
      );

      if (rows.length === 0) {
        console.log(`📦 Ejecutando migración: ${file}`);

        const sql = fs.readFileSync(
          path.join(migrationsPath, file),
          "utf8"
        );

        await pool.query(sql);

        await pool.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1)",
          [file]
        );

        console.log(`✅ Migración aplicada: ${file}`);
      }
    }

    console.log("🎯 Migraciones al día.");
  } catch (error) {
    console.error("❌ Error ejecutando migraciones:", error);
    process.exit(1);
  }
}
