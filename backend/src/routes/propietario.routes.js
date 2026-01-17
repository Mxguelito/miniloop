import { Router } from "express";
import { 
  getLiquidacionesPropietario,
  getLiquidacionActualPropietario,
  getMiPropietario,
  actualizarMiTelefono,
  crearSolicitudUnidad,
  actualizarPropietario,getLiquidacionPropietarioById,
} from "../controllers/propietario.controller.js";


import { authRequired } from "../middleware/auth.js"; 

const router = Router();



router.get("/liquidaciones", authRequired, getLiquidacionesPropietario);
router.get("/actual", authRequired, getLiquidacionActualPropietario);

// RUTA NECESARIA PARA EL DASHBOARD
router.get("/me", authRequired, getMiPropietario);

router.patch("/me", authRequired, actualizarMiTelefono);

router.post("/solicitud-unidad", authRequired, crearSolicitudUnidad);



router.get("/liquidacion/:id", authRequired, getLiquidacionPropietarioById);


router.put("/:id", authRequired, actualizarPropietario);


export default router;
