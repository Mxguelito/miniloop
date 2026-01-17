import { Router } from "express";
import { 
  getAll, 
  getById, 
  crearLiquidacion,
  update
} from "../controllers/liquidaciones.controller.js";
import { eliminar } from "../controllers/liquidaciones.controller.js";
import { fullUpdate } from "../controllers/liquidaciones.controller.js";


const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", crearLiquidacion);
router.put("/:id", update);

router.delete("/:id", eliminar);
router.put("/:id/full-update", fullUpdate);


export default router;
