import { pool } from "../config/db.js";

const DIAS_GRACIA = 7;

// ================================
// GET /suscripcion/estado
// ================================
export async function getEstadoSuscripcion(req, res) {
  try {
    // 🔴 LOG CLAVE 1
    console.log(
      "[getEstadoSuscripcion] req.user:",
      req.user
    );

    const { consorcio_id } = req.user;

    // 🔴 LOG CLAVE 2
    console.log(
      "[getEstadoSuscripcion] consorcio_id:",
      consorcio_id
    );

    const result = await pool.query(
      `
      SELECT s.*, p.nombre AS plan_nombre
      FROM suscripciones s
      JOIN planes p ON p.id = s.plan_id
      WHERE s.consorcio_id = $1
      ORDER BY s.fecha_fin DESC
      LIMIT 1
      `,
      [consorcio_id]
    );

    if (result.rows.length === 0) {
      console.log(
        "[getEstadoSuscripcion] SIN SUSCRIPCION para consorcio:",
        consorcio_id
      );

      return res.json({
        estado: "SIN_SUSCRIPCION",
      });
    }

    const suscripcion = result.rows[0];

    const hoy = new Date();
    const fechaFin = new Date(suscripcion.fecha_fin);

    let estadoReal = suscripcion.estado;
    let diasRestantes = Math.ceil(
      (fechaFin - hoy) / (1000 * 60 * 60 * 24)
    );

    if (diasRestantes < 0) {
      const fechaGracia = new Date(fechaFin);
      fechaGracia.setDate(fechaGracia.getDate() + DIAS_GRACIA);

      if (hoy <= fechaGracia) {
        estadoReal = "EN_GRACIA";
      } else {
        estadoReal = "SUSPENDIDO";
      }

      diasRestantes = 0;
    }

    console.log(
      "[getEstadoSuscripcion] RESPUESTA:",
      {
        plan: suscripcion.plan_nombre,
        estado: estadoReal,
        dias_restantes: diasRestantes,
      }
    );

    res.json({
      plan: suscripcion.plan_nombre,
      estado: estadoReal,
      fecha_fin: suscripcion.fecha_fin,
      dias_restantes: diasRestantes,
    });
  } catch (error) {
    console.error("Error estado suscripción:", error);
    res.status(500).json({ message: "Error obteniendo suscripción" });
  }
}

// ================================
// POST /suscripcion/activar
// ================================
export async function activarSuscripcion(req, res) {
  try {
    console.log("DEBUG activarSuscripcion consorcio_id:", req.user.consorcio_id);
    const { consorcio_id } = req.user;
    const { planId } = req.body;

    // 1️⃣ Borramos suscripción previa del consorcio (si existe)
    await pool.query(
      `
      DELETE FROM suscripciones
      WHERE consorcio_id = $1
      `,
      [consorcio_id]
    );

    // 2️⃣ Insertamos la nueva
    await pool.query(
      `
      INSERT INTO suscripciones (
        consorcio_id,
        plan_id,
        estado,
        fecha_inicio,
        fecha_fin
      )
      VALUES (
        $1,
        $2,
        'ACTIVO',
        NOW(),
        NOW() + INTERVAL '1 month'
      )
      `,
      [consorcio_id, planId]
    );

    res.json({ ok: true });
  } catch (error) {
    console.error("Error al activar suscripción:", error);
    res.status(500).json({ error: error.message });
  }
}

