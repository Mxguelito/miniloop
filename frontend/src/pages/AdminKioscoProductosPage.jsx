import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  { key: "snacks", label: "Snacks" },
  { key: "bebidas", label: "Bebidas" },
  { key: "limpieza", label: "Limpieza" },
];

function formatARS(n) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));
}

export default function AdminKioscoProductosPage() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "snacks",
    stock: 0,
    image_url: "",
  });

  const [uploading, setUploading] = useState(false);
const [uploadError, setUploadError] = useState("");


  const [editingId, setEditingId] = useState(null);


  const API_URL = "http://localhost:3000";

function imgSrc(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}


  async function loadProducts() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (q) params.set("q", q);

      // OJO: tu backend en getProducts deja ver todo si sos ADMIN
      const res = await axiosInstance.get(`/kiosco/products?${params.toString()}`);
      setProducts(res.data);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error cargando productos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [category, q]);

  function resetForm() {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "snacks",
      stock: 0,
      image_url: "",
    });
    setEditingId(null);
  }

  async function createProduct() {
    try {
      if (!form.name || !form.price) {
        return alert("Falta nombre o precio");
      }

      await axiosInstance.post("/kiosco/products", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock || 0),
        image_url: form.image_url,
      });

      resetForm();
      await loadProducts();
      alert("✅ Producto creado");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error creando producto");
    }
  }

 async function uploadImage(file) {
  if (!file) return;

  try {
    setUploading(true);
    setUploadError("");

    const fd = new FormData();
    fd.append("image", file); // nombre del campo

    const res = await axiosInstance.post("/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // backend debería devolver { url: "/uploads/archivo.png" }
    setForm((p) => ({ ...p, image_url: res.data.url }));
  } catch (e) {
    console.error(e);
    setUploadError(e?.response?.data?.message || "Error subiendo imagen");
  } finally {
    setUploading(false);
  }
}



  async function updateProduct() {
    try {
      if (!editingId) return;

      await axiosInstance.put(`/kiosco/products/${editingId}`, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        image_url: form.image_url,
      });

      resetForm();
      await loadProducts();
      alert("✅ Producto actualizado");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error actualizando producto");
    }
  }

  async function toggleActive(id) {
    try {
      await axiosInstance.patch(`/kiosco/products/${id}/toggle`);
      await loadProducts();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error toggle active");
    }
  }

  async function setStock(id, newStock) {
    try {
      if (newStock < 0) return;

      await axiosInstance.patch(`/kiosco/products/${id}/stock`, {
        stock: Number(newStock),
      });

      await loadProducts();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error actualizando stock");
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price ?? "",
      category: p.category || "snacks",
      stock: p.stock ?? 0,
      image_url: p.image_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function duplicateProduct(p) {
  setEditingId(null); // para que sea CREAR, no editar

  setForm({
    name: `${p.name} (copia)`,
    description: p.description || "",
    price: p.price ?? "",
    category: p.category || "snacks",
    stock: 0, // ✅ recomendado: arrancar en 0
    image_url: p.image_url || "",
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}


  const filteredCount = useMemo(() => products.length, [products]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">🛠️ Admin Kiosco - Productos</h1>
            <p className="text-gray-300 mt-2">
              Admin: <span className="font-semibold">{user?.name}</span>
            </p>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-400">Productos visibles</p>
            <p className="text-2xl font-extrabold">{filteredCount}</p>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-5">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? `✏️ Editando producto #${editingId}` : "➕ Crear producto"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nombre"
              className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
            />

            <input
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              placeholder="Precio (ARS)"
              className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
            />

            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>

            <input
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Descripción"
              className="md:col-span-2 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
            />

            <input
              value={form.image_url}
              onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
              placeholder="URL imagen (opcional)"
              className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
            />

            <div className="mt-2 flex items-center gap-3">
  <label className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition cursor-pointer text-sm font-semibold">
    {uploading ? "Subiendo..." : "Subir imagen 📷"}
    <input
      type="file"
      accept="image/*"
      className="hidden"
      disabled={uploading}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) uploadImage(file);
        e.target.value = ""; // para poder subir el mismo archivo 2 veces
      }}
    />
  </label>

  {uploadError && (
    <span className="text-sm text-red-400">{uploadError}</span>
  )}

  {form.image_url && (
    <span className="text-xs text-gray-400 truncate max-w-[320px]">
      {form.image_url}
    </span>
  )}
</div>




            {form.image_url?.trim() && (
  <div className="mt-2 bg-black/20 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
   <img
  src={imgSrc(form.image_url)}
  alt="preview"
  className="w-16 h-16 rounded-xl object-cover border border-white/10"
  onError={(e) => {
    e.currentTarget.style.display = "none";
  }}
/>

    <div className="min-w-0">
      <p className="text-sm font-semibold">Preview</p>
      <p className="text-xs text-gray-400 truncate max-w-[360px]">
        {form.image_url}
      </p>
    </div>
  </div>
)}


            {!editingId && (
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                placeholder="Stock inicial"
                className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
              />
            )}
          </div>

          <div className="mt-4 flex flex-col md:flex-row gap-3">
            {!editingId ? (
              <button
                onClick={createProduct}
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500/25 to-purple-500/25
                           border border-blue-400/25 hover:bg-white/5 transition font-bold"
                type="button"
              >
                Crear producto ✅
              </button>
            ) : (
              <button
                onClick={updateProduct}
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-green-500/25 to-emerald-500/25
                           border border-green-400/25 hover:bg-white/5 transition font-bold"
                type="button"
              >
                Guardar cambios 💾
              </button>
            )}

            <button
              onClick={resetForm}
              className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition font-semibold"
              type="button"
            >
              Cancelar
            </button>
          </div>
        </div>

        {/* FILTROS */}
        <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
            >
              <option value="">Todas las categorías</option>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>

            <button
              onClick={loadProducts}
              className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition font-semibold"
              type="button"
            >
              {loading ? "Cargando..." : "Refrescar"}
            </button>
          </div>
        </div>

        {/* LISTA */}
        <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-5 overflow-auto">
          <h2 className="text-xl font-bold mb-4">📦 Productos</h2>

          <table className="w-full text-sm">
            <thead className="text-gray-300">
              <tr className="border-b border-white/10">
                <th className="text-left py-2 pr-2">ID</th>
                <th className="text-left py-2 pr-2">IMG</th>
                 <th className="text-left py-2 pr-2">Nombre</th>

                <th className="text-left py-2 pr-2">Cat</th>
                <th className="text-left py-2 pr-2">Precio</th>
                <th className="text-left py-2 pr-2">Stock</th>
                <th className="text-left py-2 pr-2">Activo</th>
                <th className="text-right py-2">Acciones</th>
              </tr>
            </thead>

            <tbody className="text-gray-200">
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-2 pr-2 font-semibold">#{p.id}</td>
                  <td>
  {p.image_url ? (
   <img
  src={imgSrc(p.image_url)}
  alt={p.name}
  className="w-10 h-10 rounded-lg object-cover border border-white/10"
/>

  ) : (
    "—"
  )}
</td>


                  <td className="py-2 pr-2">
                    <div className="flex flex-col">
                      <span className="font-semibold">{p.name}</span>
                      <span className="text-xs text-gray-400 truncate max-w-[320px]">
                        {p.description}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 pr-2">{p.category}</td>
                  <td className="py-2 pr-2 font-semibold">{formatARS(p.price)}</td>

                  <td className="py-2 pr-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setStock(p.id, (p.stock ?? 0) - 1)}
                        className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
                        type="button"
                      >
                        -
                      </button>

                      <span className="min-w-[32px] text-center font-bold">{p.stock}</span>

                      <button
                        onClick={() => setStock(p.id, (p.stock ?? 0) + 1)}
                        className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="py-2 pr-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        p.is_active
                          ? "bg-green-500/15 border-green-400/20 text-green-200"
                          : "bg-red-500/15 border-red-400/20 text-red-200"
                      }`}
                    >
                      {p.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
                        type="button"
                      >
                        Editar
                      </button>
                      <button
  onClick={() => duplicateProduct(p)}
  className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
  type="button"
>
  Duplicar
</button>


                      <button
                        onClick={() => toggleActive(p.id)}
                        className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
                        type="button"
                      >
                        {p.is_active ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="py-6 text-gray-400">
                    No hay productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
