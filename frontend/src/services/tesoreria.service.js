// frontend/src/services/tesoreria.service.js
import axiosInstance from "../api/axiosInstance";

export async function getDashboardTesorero() {
  const { data } = await axiosInstance.get("/tesorero/dashboard");
  return data;
}
export async function getDeudoresTesorero() {
  const { data } = await axiosInstance.get("/tesorero/deudores");
  return data;
}