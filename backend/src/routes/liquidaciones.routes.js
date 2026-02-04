import { Router } from "express";
import { authRequired } from "../middleware/auth.js";


import {
  getAll,
  getById,
  crearLiquidacion,
  update,
  eliminar,
  fullUpdate,
} from "../controllers/liquidaciones.controller.js";

const router = Router();

// 🔐 PROTEGER TODAS LAS RUTAS
router.use(authRequired);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", crearLiquidacion);
router.put("/:id", update);
router.put("/:id/full-update", fullUpdate);
router.delete("/:id", eliminar);

export default router;
