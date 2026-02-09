import { Router } from "express";
import {
  getConsorcios,
  createConsorcio,
  updateConsorcio,
  deleteConsorcio,
  getUsuariosConsorcio,
  quitarUsuarioConsorcio,
  
} from "../controllers/consorcios.controller.js";

const router = Router();

router.get("/", getConsorcios);
router.post("/", createConsorcio);
router.put("/:id", updateConsorcio);
router.delete("/:id", deleteConsorcio);
router.get("/:id/usuarios", getUsuariosConsorcio);
router.delete("/:id/usuarios/:usuarioId", quitarUsuarioConsorcio);


export default router;
