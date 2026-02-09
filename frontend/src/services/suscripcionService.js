import api from "../api/axiosInstance";

export async function activarSuscripcion(planId) {
  const { data } = await api.post("/suscripcion/activar", {
    planId,
  });
  return data;
}
