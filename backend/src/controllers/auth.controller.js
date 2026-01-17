// src/controllers/auth.controller.js
import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


// generar token
function generarToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email
    },
    "miniloop_secret",        
    { expiresIn: "7d" }
  );
}


// ========================
// REGISTRO SEGURO
// ========================
export async function register(req, res) {
  const { nombre, email, password, role } = req.body;

  try {
    // 1) Validar rol permitido (evita registro como ADMIN)
    const rolesPermitidos = ["PROPIETARIO", "INQUILINO", "TESORERO"];

    const roleFinal = rolesPermitidos.includes(role)
      ? role
      : "PROPIETARIO";

    // 2) Verificar si el email ya está registrado
    const exists = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );

    if (exists.rowCount > 0) {
      return res.status(400).json({ message: "El email ya está registrado." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3) Crear usuario en estado PENDING
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, role, estado)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING id, nombre, email, role, estado`,
      [nombre, email, hashedPassword, roleFinal]
    );

    res.json({
      message: "Registro completado. Espera la aprobación del administrador.",
      user: result.rows[0]
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error registrando usuario." });
  }
}


// LOGIN

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta." });
    }

    
    // si NO es admin → requiere estado "active"
if (user.role !== "ADMIN" && user.estado !== "active") {
  return res.status(403).json({
    message: "Tu cuenta está pendiente de aprobación."
  });
}


    // generar token
    const token = generarToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error iniciando sesión." });
  }
}

export async function getAllUsers(req, res) {
  const q = await pool.query("SELECT * FROM usuarios ORDER BY id DESC");
  res.json(q.rows);
}

