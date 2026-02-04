import { Router } from "express";
import { authRequired } from "../middleware/auth.js";

import {
  getAll,
  getById,
  crearLiquidacion,
  update,
  remove,
} from "../controllers/liquidaciones.controller.js";

const router = Router();

// 🔐 PROTEGER TODAS LAS RUTAS
router.use(authRequired);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", crearLiquidacion);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
