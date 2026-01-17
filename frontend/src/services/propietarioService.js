import axiosInstance from "../api/axiosInstance";

export async function getLiquidacionesPropietario() {
  const res = await axiosInstance.get("/propietarios/liquidaciones");
  return res.data;
}

export async function getMiPropietario() {
  const res = await axiosInstance.get("/propietarios/me");
  return res.data;
}
