import { useState } from "react";
import { useKioscoProducts } from "../hooks/useKioscoProducts";
import { useImageUpload } from "../hooks/useImageUpload";
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

  const {
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
  } = useKioscoProducts();

  const { uploadImage, uploading, uploadError } = useImageUpload();

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "snacks",
    stock: 0,
    image_url: "",
  });

  const API_URL = "http://localhost:3000";

  const imgSrc = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
  };

  function resetForm() {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "snacks",
      stock: 0,
      image_url: "",
    });
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      category: p.category,
      stock: p.stock,
      image_url: p.image_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function duplicateProduct(p) {
    setEditingId(null);
    setForm({
      name: `${p.name} (copia)`,
      description: p.description || "",
      price: p.price,
      category: p.category,
      stock: 0,
      image_url: p.image_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* HERO HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1
              className="text-4xl sm:text-5xl font-black tracking-tight
              bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400
              bg-clip-text text-transparent
              drop-shadow-[0_0_25px_rgba(99,102,241,0.35)]
            "
            >
              Admin Kiosco
            </h1>
            <p className="text-sm text-gray-400 tracking-wide mt-1">
              Panel avanzado de productos · {user?.name}
            </p>
          </div>

          <div
            className="px-5 py-4 rounded-3xl
            bg-gradient-to-br from-white/10 via-white/5 to-transparent
            border border-white/10
            backdrop-blur-xl
            shadow-[0_0_30px_rgba(0,0,0,0.4)]
          "
          >
            <p className="text-xs text-gray-400">Productos visibles</p>
            <p className="text-3xl font-extrabold">{filteredCount}</p>
          </div>
        </div>

        {/* FORM */}
        <div
          className="rounded-3xl p-6
          bg-gradient-to-br from-white/10 via-white/5 to-transparent
          border border-white/10
          backdrop-blur-xl
          shadow-[0_0_60px_rgba(0,0,0,0.45)]
        "
        >
          <h2 className="text-xl font-bold mb-5">
            {editingId
              ? `Editando producto #${editingId}`
              : "Crear nuevo producto"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["name", "price", "description", "image_url"].map((field, i) => (
              <input
                key={i}
                placeholder={
                  field === "name"
                    ? "Nombre"
                    : field === "price"
                      ? "Precio (ARS)"
                      : field === "description"
                        ? "Descripción"
                        : "URL imagen"
                }
                value={form[field]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [field]: e.target.value }))
                }
                className="bg-black/40 border border-white/10 rounded-2xl
                  px-4 py-3 text-sm outline-none
                  focus:ring-2 focus:ring-cyan-400/30
                  transition"
              />
            ))}

            <select
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              className="bg-black/40 border border-white/10 rounded-2xl
                px-4 py-3 text-sm outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>

            {!editingId && (
              <input
                type="number"
                placeholder="Stock inicial"
                value={form.stock}
                onChange={(e) =>
                  setForm((p) => ({ ...p, stock: e.target.value }))
                }
                className="bg-black/40 border border-white/10 rounded-2xl
                  px-4 py-3 text-sm outline-none"
              />
            )}
          </div>

          {/* IMAGE UPLOAD */}
          <div className="mt-5 flex items-center gap-4 flex-wrap">
            <label
              className="cursor-pointer px-5 py-2 rounded-xl
              bg-gradient-to-r from-cyan-500/25 to-indigo-500/25
              border border-cyan-400/25
              hover:from-cyan-500/40 hover:to-indigo-500/40
              transition font-semibold text-sm
            "
            >
              {uploading ? "Subiendo..." : "Subir imagen"}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  if (url) setForm((p) => ({ ...p, image_url: url }));
                }}
              />
            </label>

            {uploadError && (
              <span className="text-sm text-red-400">{uploadError}</span>
            )}

            {form.image_url && (
              <img
                src={imgSrc(form.image_url)}
                className="w-16 h-16 rounded-xl object-cover border border-white/10"
              />
            )}
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() =>
                editingId
                  ? updateProduct(editingId, {
                      name: form.name,
                      description: form.description,
                      price: Number(form.price),
                      category: form.category,
                      image_url: form.image_url,
                    })
                  : createProduct({
                      ...form,
                      price: Number(form.price),
                      stock: Number(form.stock),
                    })
              }
              className="px-6 py-3 rounded-2xl font-bold
                bg-gradient-to-r from-indigo-500/30 to-fuchsia-500/30
                border border-indigo-400/30
                hover:from-indigo-500/45 hover:to-fuchsia-500/45
                transition
              "
            >
              {editingId ? "Guardar cambios" : "Crear producto"}
            </button>

            <button
              onClick={resetForm}
              className="px-6 py-3 rounded-2xl
                bg-white/10 border border-white/10
                hover:bg-white/20 transition"
            >
              Cancelar
            </button>
          </div>
        </div>

        {/* PRODUCTS GRID (mobile-first cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl p-5
                bg-gradient-to-br from-white/10 via-white/5 to-transparent
                border border-white/10
                backdrop-blur-xl
                hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]
                transition
              "
            >
              <div className="flex items-center gap-4">
                {p.image_url && (
                  <img
                    src={imgSrc(p.image_url)}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-bold truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center text-sm">
                <span>{formatARS(p.price)}</span>
                <span className="text-gray-400">Stock: {p.stock}</span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => duplicateProduct(p)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  Duplicar
                </button>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="flex-1 px-3 py-2 rounded-xl
    bg-red-500/20 border border-red-400/30
    hover:bg-red-500/40 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
