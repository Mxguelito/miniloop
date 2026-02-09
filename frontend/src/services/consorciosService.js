import axiosInstance from "../api/axiosInstance";

// ===============================
// OBTENER CONSORCIOS (DB REAL)
// ===============================
export async function getConsorcios() {
  const res = await axiosInstance.get("/consorcios");
  return res.data;
}

// ===============================
// CREAR CONSORCIO
// ===============================
export async function createConsorcio(data) {
  const res = await axiosInstance.post("/consorcios", data);
  return res.data;
}

// ===============================
// EDITAR CONSORCIO
// ===============================
export async function updateConsorcio(id, data) {
  const res = await axiosInstance.put(`/consorcios/${id}`, data);
  return res.data;
}

// ===============================
// ELIMINAR CONSORCIO
// ===============================
export async function deleteConsorcio(id) {
  const res = await axiosInstance.delete(`/consorcios/${id}`);
  return res.data;
}
