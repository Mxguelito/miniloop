import { useEffect, useMemo, useState } from "react";
import { kioscoProductsService } from "../services/kioscoProducts.service";
import toast from "react-hot-toast";


export function useKioscoProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [debouncedQ, setDebouncedQ] = useState(q);


  async function loadProducts() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (debouncedQ) params.set("q", debouncedQ);


      const res = await kioscoProductsService.getProducts(
        `?${params.toString()}`,
      );
      setProducts(res.data);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error cargando productos");
    } finally {
      setLoading(false);
    }
  }

  async function createProduct(data) {
  try {
    await kioscoProductsService.createProduct(data);
    toast.success("Producto creado ✅");
    await loadProducts();
  } catch (e) {
    toast.error(e?.response?.data?.message || "Error creando producto");
    throw e;
  }
}

async function updateProduct(id, data) {
  try {
    await kioscoProductsService.updateProduct(id, data);
    toast.success("Producto actualizado 💾");
    await loadProducts();
  } catch (e) {
    toast.error(e?.response?.data?.message || "Error actualizando producto");
    throw e;
  }
}
async function deleteProduct(id) {
  if (!window.confirm("⚠️ ¿Eliminar este producto definitivamente?")) return;

  await kioscoProductsService.deleteProduct(id);
  loadProducts();
}



 async function toggleActive(id) {
  try {
    await kioscoProductsService.toggleActive(id);
    toast.success("Estado actualizado");
    await loadProducts();
  } catch (e) {
    toast.error("Error cambiando estado");
  }
}


  async function setStock(id, newStock) {
  if (newStock < 0) return;

  // snapshot previo (para rollback)
  const prevProducts = [...products];

  // UI optimista
  setProducts((curr) =>
    curr.map((p) =>
      p.id === id ? { ...p, stock: newStock } : p
    )
  );

  try {
    await kioscoProductsService.updateStock(id, newStock);
  } catch (e) {
    console.error(e);

    // rollback si falla
    setProducts(prevProducts);
    toast.error("No se pudo actualizar el stock");
 
  }
}



  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQ(q);
  }, 400);

  return () => clearTimeout(timer);
}, [q]);


 useEffect(() => {
  loadProducts();
}, [debouncedQ, category]);


  const filteredCount = useMemo(() => products.length, [products]);

  return {
    products,
    loading,
    q,
    setQ,
    category,
    setCategory,
    filteredCount,
    loadProducts,
    createProduct,
    updateProduct,
    toggleActive,
    setStock,
     deleteProduct,
  };
}
