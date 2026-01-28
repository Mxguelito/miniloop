import axiosInstance from "../api/axiosInstance";

export const kioscoProductsService = {
  getProducts(params = "") {
    return axiosInstance.get(`/kiosco/products${params}`);
  },

  createProduct(data) {
    return axiosInstance.post("/kiosco/products", data);
  },

  updateProduct(id, data) {
    return axiosInstance.put(`/kiosco/products/${id}`, data);
  },

  toggleActive(id) {
    return axiosInstance.patch(`/kiosco/products/${id}/toggle`);
  },

  updateStock(id, stock) {
    return axiosInstance.patch(`/kiosco/products/${id}/stock`, { stock });
  },

  uploadImage(formData) {
    return axiosInstance.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteProduct(id) {
  return axiosInstance.delete(`/kiosco/products/${id}`);
}

};
