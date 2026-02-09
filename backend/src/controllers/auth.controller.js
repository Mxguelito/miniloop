// src/controllers/auth.controller.js
import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ========================
// GENERAR TOKEN
// ========================
function generarToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      consorcio_id: user.consorcio_id, // 👈 ESTA LÍNEA ES LA CLAVE
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

// ========================
// REGISTRO
// ========================
export async function register(req, res) {
  const { nombre, email, password, role } = req.body;

  try {
    // Roles permitidos
    const rolesPermitidos = ["PROPIETARIO", "INQUILINO", "TESORERO"];
    const roleFinal = rolesPermitidos.includes(role) ? role : "PROPIETARIO";

    // Verificar email existente
    const exists = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email],
    );

    if (exists.rowCount > 0) {
      return res.status(400).json({
        message: "El email ya está registrado",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario (PENDING)
    const result = await pool.query(
      `
      INSERT INTO usuarios (nombre, email, password, role, estado)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING id, nombre, email, role, estado
      `,
      [nombre, email, hashedPassword, roleFinal],
    );

    res.json({
      message: "Registro completado. Espera aprobación del administrador.",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("❌ ERROR REGISTER:", err);
    res.status(500).json({
      message: "Error registrando usuario",
    });
  }
}

// ========================
// LOGIN
// ========================
// ========================
// LOGIN (FIX DEFINITIVO)
// ========================
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.nombre,
        u.email,
        u.password,
        u.role,
        u.estado,
        p.consorcio_id
      FROM usuarios u
      LEFT JOIN propietarios p ON p.usuario_id = u.id
      WHERE u.email = $1
      `,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "Usuario no encontrado",
      });
    }

    const user = result.rows[0];

    // 🔐 Validar password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        message: "Contraseña incorrecta",
      });
    }

    // 🚫 Usuario no admin debe estar activo
    if (user.role !== "ADMIN" && user.estado !== "active") {
      return res.status(403).json({
        message: "Tu cuenta está pendiente de aprobación",
      });
    }

    // 🏢 Validación fuerte de consorcio
    if (user.role === "PROPIETARIO" && !user.consorcio_id) {
      return res.status(400).json({
        message: "El propietario no tiene consorcio asignado",
      });
    }

    // 🔑 Generar token con consorcio_id
    const token = generarToken({
      id: user.id,
      role: user.role,
      email: user.email,
      consorcio_id: user.consorcio_id ?? null,
    });

    // ✅ RESPUESTA LIMPIA Y COMPLETA
    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        consorcio_id: user.consorcio_id ?? null,
      },
    });
  } catch (err) {
    console.error("❌ ERROR LOGIN:", err);
    res.status(500).json({
      message: "Error iniciando sesión",
    });
  }
}


// ========================
// LISTAR USUARIOS (ADMIN)
// ========================
export async function getAllUsers(req, res) {
  try {
    const q = await pool.query(
      "SELECT id, nombre, email, role, estado FROM usuarios ORDER BY id DESC",
    );
    res.json(q.rows);
  } catch (err) {
    console.error("❌ ERROR GET USERS:", err);
    res.status(500).json({ message: "Error obteniendo usuarios" });
  }
}
