import { pool } from "../config/db.js";

const DIAS_GRACIA = 7;

// ================================
// GET /suscripcion/estado
// ================================
export async function getEstadoSuscripcion(req, res) {
  try {
    const { consorcio_id } = req.user;

    const result = await pool.query(
      `
      SELECT s.*, p.nombre AS plan_nombre
      FROM suscripciones s
      JOIN planes p ON p.id = s.plan_id
      WHERE s.consorcio_id = $1
      ORDER BY s.fecha_fin DESC
      LIMIT 1
      `,
      [consorcio_id],
    );

    if (result.rows.length === 0) {
      return res.json({
        estado: "SIN_SUSCRIPCION",
      });
    }

    const suscripcion = result.rows[0];

    const hoy = new Date();
    const fechaFin = new Date(suscripcion.fecha_fin);

    let estadoReal = suscripcion.estado;
    let diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));

    // 🔥 SOLO recalcular automáticamente si el estado es ACTIVO
    if (suscripcion.estado === "ACTIVO") {
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
    }

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
    const { consorcio_id } = req.user;
    const { plan } = req.body; // ahora recibimos el nombre

    if (!plan) {
      return res.status(400).json({ error: "Plan requerido" });
    }

    // 🔎 1. Buscar el plan en la tabla planes
    const planResult = await pool.query(
      `SELECT id FROM planes WHERE nombre = $1`,
      [plan],
    );

    if (planResult.rows.length === 0) {
      return res.status(400).json({ error: "Plan inválido" });
    }

    const planId = planResult.rows[0].id;

    // 🗑 2. Borrar suscripción anterior
    await pool.query(`DELETE FROM suscripciones WHERE consorcio_id = $1`, [
      consorcio_id,
    ]);

    // ➕ 3. Insertar nueva
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
      [consorcio_id, planId],
    );

    res.json({ ok: true });
  } catch (error) {
    console.error("Error al activar suscripción:", error);
    res.status(500).json({ error: error.message });
  }
}
export const adminUpdateSuscripcion = async (req, res) => {
  try {
    const { consorcioId } = req.params;
    const { plan, estado } = req.body;

    // 1️⃣ Verificar que exista suscripción
    const existing = await pool.query(
      "SELECT * FROM suscripciones WHERE consorcio_id = $1",
      [consorcioId],
    );

    if (existing.rows.length === 0) {
      // Si no existe, crear una nueva
      let planId = null;

      if (plan) {
        const planResult = await pool.query(
          "SELECT id FROM planes WHERE nombre = $1 AND activo = true",
          [plan],
        );

        if (planResult.rows.length === 0) {
          return res.status(404).json({ error: "Plan no encontrado" });
        }

        planId = planResult.rows[0].id;
      } else {
        // default a BASIC si no mandan plan
        const basicPlan = await pool.query(
          "SELECT id FROM planes WHERE nombre = 'BASIC'",
        );
        planId = basicPlan.rows[0].id;
      }

      await pool.query(
        `INSERT INTO suscripciones
     (consorcio_id, plan_id, estado, fecha_inicio, fecha_fin)
     VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '1 month')`,
        [consorcioId, planId, estado || "ACTIVO"],
      );

      return res.json({ ok: true, created: true });
    }

    let planId = null;

    // 2️⃣ Si viene plan → buscar id
    if (plan) {
      const planResult = await pool.query(
        "SELECT id FROM planes WHERE nombre = $1 AND activo = true",
        [plan],
      );

      if (planResult.rows.length === 0) {
        return res.status(404).json({ error: "Plan no encontrado" });
      }

      planId = planResult.rows[0].id;
    }

    // 3️⃣ Construir update dinámico
    const updates = [];
    const values = [];
    let index = 1;

    if (planId) {
      updates.push(`plan_id = $${index++}`);
      values.push(planId);
    }

    if (estado) {
      updates.push(`estado = $${index++}`);
      values.push(estado);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "Nada para actualizar" });
    }

    values.push(consorcioId);

    await pool.query(
      `UPDATE suscripciones
       SET ${updates.join(", ")}
       WHERE consorcio_id = $${index}`,
      values,
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error actualizando suscripción" });
  }
};
