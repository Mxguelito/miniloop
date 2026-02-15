import { pool } from "../config/db.js";

// ===============================
// GET /api/consorcios
// ===============================
export async function getConsorcios(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT
        c.id,
        c.nombre,
        c.direccion,
        c.creado_en,
        COALESCE(p.usuarios_count, 0) AS usuarios_count
      FROM consorcios c
      LEFT JOIN (
        SELECT
          consorcio_id,
          COUNT(*)::int AS usuarios_count
        FROM propietarios
        GROUP BY consorcio_id
      ) p ON p.consorcio_id = c.id
      ORDER BY c.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ Error getConsorcios:", err);
    res.status(500).json({ message: "Error al obtener consorcios" });
  }
}

// ===============================
// POST /api/consorcios
// ===============================
export async function createConsorcio(req, res) {
  const { nombre, direccion } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO consorcios (nombre, direccion)
      VALUES ($1, $2)
      RETURNING *
      `,
      [nombre, direccion || null],
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("❌ Error createConsorcio:", err);
    res.status(500).json({ message: "Error al crear consorcio" });
  }
}

// ===============================
// PUT /api/consorcios/:id
// ===============================
export async function updateConsorcio(req, res) {
  const { id } = req.params;
  const { nombre, direccion } = req.body;

  try {
    const { rowCount } = await pool.query(
      `
      UPDATE consorcios
      SET nombre = $1, direccion = $2
      WHERE id = $3
      `,
      [nombre, direccion, id],
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Consorcio no encontrado" });
    }

    res.json({ message: "Consorcio actualizado" });
  } catch (err) {
    console.error("❌ Error updateConsorcio:", err);
    res.status(500).json({ message: "Error al actualizar consorcio" });
  }
}

// ===============================
// DELETE /api/consorcios/:id
// ===============================
export async function deleteConsorcio(req, res) {
  const { id } = req.params;

  try {
    // 1️⃣ Verificar si tiene usuarios asociados
    const { rows } = await pool.query(
      `
      SELECT COUNT(*)::int AS total
      FROM (
        SELECT usuario_id FROM propietarios WHERE consorcio_id = $1
        UNION
        SELECT usuario_id FROM inquilinos WHERE consorcio_id = $1
      ) t
      `,
      [id],
    );

    if (rows[0].total > 0) {
      return res.status(409).json({
        message:
          "No se puede eliminar el consorcio porque tiene usuarios asignados",
      });
    }

    // 2️⃣ Eliminar consorcio
    const result = await pool.query("DELETE FROM consorcios WHERE id = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Consorcio no encontrado",
      });
    }

    res.json({ message: "Consorcio eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error deleteConsorcio:", err);
    res.status(500).json({
      message: "Error al eliminar consorcio",
    });
  }
}

// ===============================
// GET /api/consorcios/:id/usuarios
// ===============================
export async function getUsuariosConsorcio(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `
      SELECT
        u.id,
        u.nombre,
        u.email,
        u.role,
        u.estado
      FROM usuarios u
      INNER JOIN propietarios p ON p.usuario_id = u.id
      WHERE p.consorcio_id = $1
      ORDER BY u.nombre
      `,
      [id],
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Error getUsuariosConsorcio:", err);
    res.status(500).json({
      message: "Error al obtener usuarios del consorcio",
    });
  }
}

// ===============================
// DELETE /api/consorcios/:id/usuarios/:usuarioId
// ===============================
export async function quitarUsuarioConsorcio(req, res) {
  const { id, usuarioId } = req.params;

  try {
    await pool.query("BEGIN");

    // Quitar como propietario
    await pool.query(
      `
      DELETE FROM propietarios
      WHERE usuario_id = $1 AND consorcio_id = $2
      `,
      [usuarioId, id],
    );

    // Quitar como inquilino
    await pool.query(
      `
      DELETE FROM inquilinos
      WHERE usuario_id = $1 AND consorcio_id = $2
      `,
      [usuarioId, id],
    );

    await pool.query("COMMIT");

    res.json({ message: "Usuario quitado del consorcio" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("❌ Error quitarUsuarioConsorcio:", err);
    res.status(500).json({
      message: "Error al quitar usuario del consorcio",
    });
  }
}
// ===============================
const DIAS_GRACIA = 7;

export async function getSuscripcionConsorcioAdmin(req, res) {
  try {
    const { id: consorcioId } = req.params;

    const result = await pool.query(
      `
      SELECT s.*, p.nombre AS plan_nombre
      FROM suscripciones s
      JOIN planes p ON p.id = s.plan_id
      WHERE s.consorcio_id = $1
      ORDER BY s.fecha_fin DESC
      LIMIT 1
      `,
      [consorcioId]
    );

    // 🔹 SIN SUSCRIPCIÓN
    if (result.rows.length === 0) {
      return res.json({
        estado: "SIN_SUSCRIPCION",
        plan: "BASIC",
        dias_restantes: null,
        fecha_fin: null,
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

    return res.json({
      plan: suscripcion.plan_nombre,
      estado: estadoReal,
      fecha_fin: suscripcion.fecha_fin,
      dias_restantes: diasRestantes,
    });
  } catch (error) {
    console.error("Error getSuscripcionConsorcioAdmin:", error);
    res.status(500).json({
      message: "Error obteniendo suscripción del consorcio",
    });
  }
}