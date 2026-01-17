import { pool } from "../config/db.js";

// =========================================
//  Obtener propietarios con su consorcio
// =========================================
export async function getPropietarios(req, res) {
  try {
    const query = `
      SELECT 
        p.id AS propietario_id,
        p.nombre,
        p.email,
        p.piso,
        p.dpto,
        p.consorcio_id,
        c.nombre AS consorcio_nombre
      FROM propietarios p
      LEFT JOIN consorcios c ON c.id = p.consorcio_id
      ORDER BY p.id;
    `;

    const { rows } = await pool.query(query);

    return res.json(rows);

  } catch (err) {
    console.error("❌ Error obteniendo propietarios:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}
// =========================================
//  Publicar liquidación (BORRADOR -> CERRADA)
// =========================================
export async function publicarLiquidacion(req, res) {
  const { id } = req.params;

  try {
    // 1) Validar que exista y ver su estado actual
    const { rows } = await pool.query(
      "SELECT id, estado FROM liquidaciones WHERE id = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Liquidación no encontrada" });
    }

    const liquidacion = rows[0];

   // 2) Solo se puede publicar si está en BORRADOR (normalizado)
const estadoDB = String(liquidacion.estado || "").trim().toUpperCase();

if (estadoDB !== "BORRADOR") {
  return res.status(400).json({
    error: "La liquidación ya fue publicada o no está en borrador",
    estadoActual: liquidacion.estado,
  });
}



    // 3) Cambiar estado a CERRADA
    await pool.query(
      "UPDATE liquidaciones SET estado = 'CERRADA' WHERE id = $1",
      [id]
    );

    return res.json({
      message: "✅ Liquidación publicada",
      id: liquidacion.id,
      estado: "CERRADA",
    });

  } catch (err) {
    console.error("❌ Error publicando liquidación:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}