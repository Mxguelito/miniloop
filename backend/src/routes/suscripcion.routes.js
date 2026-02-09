import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
  getEstadoSuscripcion,
  activarSuscripcion,
} from "../controllers/suscripcion.controller.js";

const router = Router();

// Estado actual de la suscripción
router.get("/estado", authRequired, getEstadoSuscripcion);

// Simulación de pago → activar suscripción
router.post("/activar", authRequired, activarSuscripcion);

export default router;
