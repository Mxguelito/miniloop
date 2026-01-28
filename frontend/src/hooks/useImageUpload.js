import { useState } from "react";
import { kioscoProductsService } from "../services/kioscoProducts.service";
import toast from "react-hot-toast";


export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function uploadImage(file) {
    if (!file) return null;

    try {
      setUploading(true);
      setUploadError("");

      const fd = new FormData();
      fd.append("image", file);

     const res = await kioscoProductsService.uploadImage(fd);
toast.success("Imagen subida 📷");
return res.data.url;

    } catch (e) {
  console.error(e);
  const msg =
    e?.response?.data?.message || "Error subiendo imagen";

  setUploadError(msg);
  toast.error(msg);
  return null;
}
finally {
      setUploading(false);
    }
  }

  return { uploadImage, uploading, uploadError };
}
