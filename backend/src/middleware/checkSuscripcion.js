import { pool } from "../config/db.js";

const DIAS_GRACIA = 7; // después lo podemos mover a planes

export async function checkSuscripcion(req, res, next) {
  try {
    const { consorcio_id } = req.user; 
    // asumimos que viene del JWT

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
      return res.status(403).json({
        message: "El consorcio no tiene una suscripción activa",
      });
    }

    const suscripcion = result.rows[0];

    const hoy = new Date();
    const fechaFin = new Date(suscripcion.fecha_fin);

    let estadoReal = suscripcion.estado;

    // venció
    if (hoy > fechaFin) {
      const fechaGracia = new Date(fechaFin);
      fechaGracia.setDate(fechaGracia.getDate() + DIAS_GRACIA);

      if (hoy <= fechaGracia) {
        estadoReal = "EN_GRACIA";
      } else {
        estadoReal = "SUSPENDIDA";
      }
    }

    // 👉 guardamos info útil para el resto del request
    req.suscripcion = {
      ...suscripcion,
      estadoReal,
    };

    // ❌ bloqueamos acciones solo si está suspendida
    if (estadoReal === "SUSPENDIDA") {
      return res.status(403).json({
        message:
          "Suscripción suspendida. Renová el plan para continuar operando.",
      });
    }

    next();
  } catch (error) {
    console.error("Error en checkSuscripcion:", error);
    res.status(500).json({ message: "Error validando suscripción" });
  }
}
