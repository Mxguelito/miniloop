import express from "express";
import { 
  getUsuariosPendientes,
  approveUser,
  rejectUser,
  deleteUser,
  updateUser,
  getSolicitudesUnidadPendientes,
  aprobarSolicitudUnidad,
  rechazarSolicitudUnidad,
  deactivateUser,
   
} from "../controllers/admin.controller.js";
import { authRequired } from "../middleware/auth.js";


const router = express.Router();

router.get("/usuarios-pendientes", getUsuariosPendientes);
router.patch("/usuarios/:id/approve", approveUser);
router.patch("/usuarios/:id/reject", rejectUser);
router.delete("/usuarios/:id", deleteUser);
router.patch("/usuarios/:id", updateUser);
router.get("/solicitudes-unidad", authRequired, getSolicitudesUnidadPendientes);
router.patch("/solicitudes-unidad/:id/aprobar", authRequired, aprobarSolicitudUnidad);
router.patch("/solicitudes-unidad/:id/rechazar", authRequired, rechazarSolicitudUnidad);
router.patch("/usuarios/:id/deactivate", authRequired, deactivateUser);



export default router;
