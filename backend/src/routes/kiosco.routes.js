import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
  getProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminUpdateStock,
  adminToggleActive,
  createOrder,
    adminGetOrders,
  adminGetOrderById,
  adminUpdateOrderStatus,

} from "../controllers/kiosco.controller.js";

const router = Router();

// Todos logueados pueden ver productos (activos)
router.get("/products", authRequired, getProducts);

// Admin: CRUD básico
router.post("/products", authRequired, adminCreateProduct);
router.put("/products/:id", authRequired, adminUpdateProduct);
router.patch("/products/:id/stock", authRequired, adminUpdateStock);
router.patch("/products/:id/toggle", authRequired, adminToggleActive);
router.post("/orders", authRequired, createOrder);

// Admin: pedidos/ventas
router.get("/orders", authRequired, adminGetOrders);
router.get("/orders/:id", authRequired, adminGetOrderById);
router.patch("/orders/:id/status", authRequired, adminUpdateOrderStatus);



export default router;
