import { pool } from "../config/db.js";

// Días de gracia globales (luego pueden venir desde el plan)
const DIAS_GRACIA = 7;

/**
 * Middleware de validación de suscripción por CONSORCIO
 * Fuente de verdad: backend
 *
 * Estados oficiales:
 * - ACTIVO
 * - EN_GRACIA
 * - SUSPENDIDO
 * - SIN_SUSCRIPCION
 */
export async function checkSuscripcion(req, res, next) {
  try {
    // El consorcio_id viene del JWT
    const { consorcio_id } = req.user;

    // 1) Buscamos la última suscripción del consorcio
    const result = await pool.query(
      `
      SELECT
        s.*,
        p.nombre AS plan_nombre
      FROM suscripciones s
      JOIN planes p ON p.id = s.plan_id
      WHERE s.consorcio_id = $1
      ORDER BY s.fecha_fin DESC
      LIMIT 1
      `,
      [consorcio_id],
    );

    // 2) Sin suscripción
    if (result.rows.length === 0) {
      return res.status(403).json({
        estado: "SIN_SUSCRIPCION",
        message: "El consorcio no tiene una suscripción activa",
      });
    }

    const suscripcion = result.rows[0];

    // 3) Cálculo de estado real
    const hoy = new Date();
    const fechaFin = new Date(suscripcion.fecha_fin);

    let estadoReal = suscripcion.estado; // ACTIVO por default

    if (hoy > fechaFin) {
      const fechaGracia = new Date(fechaFin);
      fechaGracia.setDate(fechaGracia.getDate() + DIAS_GRACIA);

      if (hoy <= fechaGracia) {
        estadoReal = "EN_GRACIA";
      } else {
        estadoReal = "SUSPENDIDO";
      }
    }

    // 4) Exponemos info útil para el resto del request
    req.suscripcion = {
      id: suscripcion.id,
      consorcio_id: suscripcion.consorcio_id,
      plan_id: suscripcion.plan_id,
      plan_nombre: suscripcion.plan_nombre,
      estado: suscripcion.estado,
      estadoReal,
      fecha_inicio: suscripcion.fecha_inicio,
      fecha_fin: suscripcion.fecha_fin,
    };

    // 5) Bloqueo duro solo si está SUSPENDIDO
    if (estadoReal === "SUSPENDIDO") {
      return res.status(403).json({
        estado: "SUSPENDIDO",
        message:
          "Suscripción suspendida. Renová el plan para continuar operando.",
      });
    }

    // 6) ACTIVO o EN_GRACIA → continúa
    next();
  } catch (error) {
    console.error("Error en checkSuscripcion:", error);
    res.status(500).json({
      message: "Error validando la suscripción del consorcio",
    });
  }
}
