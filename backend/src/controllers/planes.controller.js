import { pool } from "../config/db.js";

// GET /api/planes
export async function getPlanes(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT id, nombre FROM planes ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo planes" });
  }
}

// POST /api/planes
export async function createPlan(req, res) {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: "Nombre requerido" });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO planes (nombre) VALUES ($1) RETURNING *",
      [nombre]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando plan" });
  }
}

// PATCH /api/planes/:id
export async function updatePlan(req, res) {
  const { id } = req.params;
  const { nombre } = req.body;

  try {
    await pool.query(
      "UPDATE planes SET nombre = $1 WHERE id = $2",
      [nombre, id]
    );
    res.json({ message: "Plan actualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando plan" });
  }
}
