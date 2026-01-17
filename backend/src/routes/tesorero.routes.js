import express from "express";
import { getPropietarios,publicarLiquidacion } from "../controllers/tesorero.controller.js";

const router = express.Router();

router.get("/propietarios", getPropietarios);
router.patch("/liquidaciones/:id/publicar", publicarLiquidacion);
export default router;
