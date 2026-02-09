import { Router } from "express";
import {
  getPlanes,
  createPlan,
  updatePlan,
} from "../controllers/planes.controller.js";

const router = Router();

router.get("/", getPlanes);
router.post("/", createPlan);
router.patch("/:id", updatePlan);

export default router;
