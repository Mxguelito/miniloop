import express from "express";
import { getPropietarios,publicarLiquidacion,getDashboardTesorero,getDeudores, } from "../controllers/tesorero.controller.js";

const router = express.Router();

router.get("/propietarios", getPropietarios);
router.patch("/liquidaciones/:id/publicar", publicarLiquidacion);
//  NUEVA RUTA
router.get("/dashboard", getDashboardTesorero);

router.get("/deudores", getDeudores);
export default router;
