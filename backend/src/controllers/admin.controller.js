
// ADMIN CONTROLLER COMPLETO


import { pool } from "../config/db.js";

// Obtener usuarios pendientes
export async function getUsuariosPendientes(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, nombre, email, role FROM usuarios WHERE estado = 'pending'"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo usuarios." });
  }
}

// APROBAR USUARIO
export async function approveUser(req, res) {
  const { id } = req.params;

  try {
    // 1) Obtener usuario
    const userRes = await pool.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [id]
    );

    if (userRes.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const user = userRes.rows[0];

    // 2) ADMIN no necesita aprobación
    if (user.role === "ADMIN") {
      return res.status(400).json({ message: "El administrador no requiere aprobación." });
    }

    // 3) Cambiar estado a active
    await pool.query("UPDATE usuarios SET estado='active' WHERE id=$1", [id]);

    // 4) SI EL USUARIO ES PROPIETARIO → crear perfil en propietarios
    if (user.role === "PROPIETARIO") {
  await pool.query(
    `INSERT INTO propietarios 
      (usuario_id, nombre, email, unidad, piso, dpto, consorcio_id)
     VALUES ($1, $2, $3, null, null, null, 1)`,   
    [user.id, user.nombre, user.email]
  );
}


    // 5) SI ES INQUILINO → crear perfil en inquilinos
    if (user.role === "INQUILINO") {
      await pool.query(
        `INSERT INTO inquilinos 
          (usuario_id, nombre, email, unidad, piso, dpto)
         VALUES ($1, $2, $3, null, null, null)`,
        [user.id, user.nombre, user.email]
      );
    }

    res.json({ message: "Usuario aprobado y perfil generado.", role: user.role });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error aprobando usuario" });
  }
}

// RECHAZAR USUARIO
export async function rejectUser(req, res) {
  const { id } = req.params;
  await pool.query("UPDATE usuarios SET estado='rejected' WHERE id=$1", [id]);
  res.json({ message: "Usuario rechazado" });
}

// BORRAR USUARIO (BORRADO FÍSICO COMPLETO)
// BORRAR USUARIO (BORRADO FÍSICO DEFINITIVO CON CASCADA)
export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    // 1️⃣ Buscar usuario
    const userRes = await pool.query(
      "SELECT id, role, estado FROM usuarios WHERE id = $1",
      [id]
    );

    if (userRes.rowCount === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado."
      });
    }

    const user = userRes.rows[0];

    // 2️⃣ No permitir borrar ADMIN
    if (user.role === "ADMIN") {
      return res.status(400).json({
        message: "No se puede eliminar un administrador."
      });
    }

    // 3️⃣ No permitir borrar usuarios activos
    if (user.estado === "active") {
      return res.status(400).json({
        message: "No se puede eliminar un usuario activo."
      });
    }

    // 4️⃣ BORRADO REAL
    // ⚠️ Gracias a ON DELETE CASCADE:
    // - propietarios
    // - inquilinos
    // - futuras tablas relacionadas
    // se eliminan solas
    await pool.query(
      "DELETE FROM usuarios WHERE id = $1",
      [id]
    );

    return res.json({
      message: "Usuario eliminado definitivamente."
    });

  } catch (err) {
    console.error("❌ Error eliminando usuario:", err);
    return res.status(500).json({
      message: "Error interno al eliminar usuario."
    });
  }
}

// EDITAR USUARIO ACTIVO (nombre / email)
export async function updateUser(req, res) {
  const { id } = req.params;
  const { nombre, email } = req.body;

  try {
    //  Buscar usuario
    const userRes = await pool.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [id]
    );

    if (userRes.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = userRes.rows[0];

    //  Validar que esté activo
    if (user.estado !== "active") {
      return res.status(400).json({
        message: "Solo se pueden editar usuarios activos"
      });
    }

    //  Actualizar
    await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, email = $2 
       WHERE id = $3`,
      [nombre, email, id]
    );

    res.json({ message: "Usuario actualizado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al editar usuario" });
  }
}
// DESACTIVAR USUARIO (OCULTAR SIN BORRAR)
export async function deactivateUser(req, res) {
  const { id } = req.params;

  try {
    const userRes = await pool.query(
      "SELECT id, role, estado FROM usuarios WHERE id = $1",
      [id]
    );

    if (userRes.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const user = userRes.rows[0];

    if (user.role === "ADMIN") {
      return res.status(400).json({
        message: "No se puede desactivar un administrador."
      });
    }

    if (user.estado !== "active") {
      return res.status(400).json({
        message: "El usuario ya está desactivado."
      });
    }

    await pool.query(
      "UPDATE usuarios SET estado = 'inactive' WHERE id = $1",
      [id]
    );

    res.json({ message: "Usuario desactivado correctamente." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error desactivando usuario." });
  }
}

// OBTENER SOLICITUDES DE UNIDAD PENDIENTES

export async function getSolicitudesUnidadPendientes(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT 
        su.id,
        su.piso,
        su.dpto,
        su.unidad,
        su.estado,
        su.creado_en,
        p.id as propietario_id,
        p.nombre,
        p.email,
        p.telefono
      FROM solicitudes_unidad su
      JOIN propietarios p ON p.id = su.propietario_id
      WHERE su.estado = 'pending'
      ORDER BY su.creado_en DESC
    `);

    return res.json(rows);
  } catch (err) {
    console.error("❌ Error en getSolicitudesUnidadPendientes:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}
export async function aprobarSolicitudUnidad(req, res) {
  try {
    const { id } = req.params;

    // 1) Traer la solicitud
    const sol = await pool.query(
      `SELECT id, propietario_id, piso, dpto, unidad
       FROM solicitudes_unidad
       WHERE id = $1`,
      [id]
    );

    if (sol.rowCount === 0) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    const s = sol.rows[0];

    // 2) Marcar solicitud como aprobada
    await pool.query(
      `UPDATE solicitudes_unidad
       SET estado = 'approved'
       WHERE id = $1`,
      [id]
    );

    // 3) Impactar cambios en propietarios
    await pool.query(
      `UPDATE propietarios
       SET piso = $1, dpto = $2, unidad = $3
       WHERE id = $4`,
      [s.piso, s.dpto, s.unidad, s.propietario_id]
    );

    return res.json({ message: "Solicitud aprobada y propietario actualizado" });
  } catch (err) {
    console.error("❌ aprobarSolicitudUnidad:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}
export async function rechazarSolicitudUnidad(req, res) {
  try {
    const { id } = req.params;

    const upd = await pool.query(
      `UPDATE solicitudes_unidad
       SET estado = 'rejected'
       WHERE id = $1`,
      [id]
    );

    if (upd.rowCount === 0) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    return res.json({ message: "Solicitud rechazada" });
  } catch (err) {
    console.error("❌ rechazarSolicitudUnidad:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

