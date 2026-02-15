import { Router } from "express";
import {
  getConsorcios,
  createConsorcio,
  updateConsorcio,
  deleteConsorcio,
  getUsuariosConsorcio,
  quitarUsuarioConsorcio,
  getSuscripcionConsorcioAdmin,
  
} from "../controllers/consorcios.controller.js";
import { authRequired } from "../middleware/auth.js";




const router = Router();

router.get("/", getConsorcios);
router.post("/", createConsorcio);
router.put("/:id", updateConsorcio);
router.delete("/:id", deleteConsorcio);
router.get("/:id/usuarios", getUsuariosConsorcio);
router.delete("/:id/usuarios/:usuarioId", quitarUsuarioConsorcio);
router.get(
  "/:id/suscripcion",
  authRequired,
  getSuscripcionConsorcioAdmin
);





export default router;
