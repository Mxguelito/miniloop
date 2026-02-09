import axiosInstance from "../api/axiosInstance";

export async function getPlanes() {
  const res = await axiosInstance.get("/planes");
  return res.data;
}

export async function createPlan(data) {
  const res = await axiosInstance.post("/planes", data);
  return res.data;
}

export async function deletePlan(id) {
  await axiosInstance.delete(`/planes/${id}`);
}

export async function updatePlan(id, payload) {
  const res = await fetch(`/api/planes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Error actualizando plan");
  }

  return res.json();
}
