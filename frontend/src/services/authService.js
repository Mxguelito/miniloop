import axiosInstance from "../api/axiosInstance";


// REGISTRO

export async function registerUser(data) {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
}

// LOGIN

export async function loginUser(data) {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
}
