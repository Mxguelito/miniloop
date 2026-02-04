import axiosInstance from "../api/axiosInstance";

// =====================
// LIQUIDACIONES TESORERO
// =====================

// Obtener todas
export async function getLiquidaciones() {
  const res = await axiosInstance.get("/liquidaciones");
  return res.data;
}

// Obtener una liquidación por ID
export async function getLiquidacion(id) {
  const res = await axiosInstance.get(`/liquidaciones/${id}`);
  return res.data;
}

// Crear liquidación
export async function createLiquidacion(data) {
  const res = await axiosInstance.post("/liquidaciones", data);
  return res.data;
}

// Actualizar liquidación
export async function updateLiquidacion(id, data) {
  const res = await axiosInstance.put(`/liquidaciones/${id}`, data);
  return res.data;
}

// Eliminar liquidación
export async function deleteLiquidacion(id) {
  const res = await axiosInstance.delete(`/liquidaciones/${id}`);
  return res.data;
}

// Update completo
export async function updateLiquidacionFull(id, payload) {
  const res = await axiosInstance.put(
    `/liquidaciones/${id}/full-update`,
    payload
  );
  return res.data;
}

// =====================
// LIQUIDACIONES PROPIETARIO
// =====================

export async function getLiquidacionesPropietario() {
  const res = await axiosInstance.get("/propietario/liquidaciones");
  return res.data;
}

export async function getLiquidacionPropietario(id) {
  const res = await axiosInstance.get(`/propietario/liquidaciones/${id}`);
  return res.data;
}

// =====================
// UTILIDADES
// =====================

export function formatMoney(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value || 0);
}
