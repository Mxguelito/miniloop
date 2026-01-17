import { useMemo, useState,useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";





const CATEGORIES = [
  { key: "snacks", label: "Snacks", emoji: "🍫" },
  { key: "bebidas", label: "Bebidas", emoji: "🥤" },
  { key: "limpieza", label: "Limpieza", emoji: "🧼" },
];

const API_URL = "http://localhost:3000";

function imgSrc(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}



function formatARS(n) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

function Badge({ children }) {
  return (
    <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">
      {children}
    </span>
  );
}

function QtyButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-xl bg-black/30 border border-white/10 hover:bg-white/5 transition"
      type="button"
    >
      {children}
    </button>
  );
}

export default function KioscoPage() {
  const { user } = useAuth();
  
  

  const [activeCategory, setActiveCategory] = useState("snacks");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({}); // { [productId]: qty }
  const [openCart, setOpenCart] = useState(false);
  const [products, setProducts] = useState([]);
const [loadingProducts, setLoadingProducts] = useState(false);
const [orderModal, setOrderModal] = useState(null); // null | { itemsCount, total, eta, place, orderId }



async function loadProducts() {
  try {
    setLoadingProducts(true);

    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (query) params.set("q", query);

    const res = await axiosInstance.get(`/kiosco/products?${params.toString()}`);
    setProducts(res.data);
  } catch (err) {
    console.error("Error cargando productos:", err);
  } finally {
    setLoadingProducts(false);
  }
}

useEffect(() => {
  loadProducts();
}, [activeCategory, query]);



  


 const filteredProducts = products; // ya viene filtrado del backend




 const cartItems = useMemo(() => {
  return Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((p) => p.id === Number(id));
      if (!product) return null;
      return { ...product, qty, subtotal: product.price * qty };
    })
    .filter(Boolean);
}, [cart, products]);


  const cartCount = useMemo(
    () => cartItems.reduce((acc, it) => acc + it.qty, 0),
    [cartItems]
  );

  const total = useMemo(
    () => cartItems.reduce((acc, it) => acc + it.subtotal, 0),
    [cartItems]
  );

    function stockDisponible(productId) {
    const p = products.find((x) => x.id === Number(productId));
    return p?.stock ?? 0;
  }

  function qtyEnCarrito(productId) {
    return cart[productId] || 0;
  }


    function addToCart(productId) {
    const stock = stockDisponible(productId);
    const enCarrito = qtyEnCarrito(productId);

    if (enCarrito >= stock) return; // no deja pasar

    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  }


  function decFromCart(productId) {
    setCart((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: current - 1 };
    });
  }

  function clearCart() {
    setCart({});
  }

async function confirmOrder() {
  try {
    const items = Object.entries(cart).map(([id, qty]) => ({
      product_id: Number(id),
      qty: Number(qty),
    }));

    if (items.length === 0) return;

    const res = await axiosInstance.post("/kiosco/orders", {
      notes: "Pedido desde kiosco",
      items,
    });

    // limpiar UI
    clearCart();
    setOpenCart(false);

    // abrir modal lindo
    setOrderModal({
      orderId: res.data.order.id,
      itemsCount: cartCount,
      total,
      eta: "15–25 min",
      place: "Hall principal / Portería",
    });

    // refrescar productos (stock nuevo)
    await loadProducts();
  } catch (err) {
    alert(err?.response?.data?.message || "Error confirmando pedido");
  }
}




  return (
    <AppLayout>
        <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            🛒 Kiosco del Consorcio
          </h1>
          <p className="text-gray-300 mt-2">
            Compras internas rápidas — usuario:{" "}
            <span className="font-semibold">{user?.name}</span>
          </p>
        </div>

        {/* CART BUTTON */}
        <button
          onClick={() => setOpenCart((v) => !v)}
          className="self-start md:self-auto px-4 py-3 rounded-2xl
                     bg-gradient-to-r from-blue-500/20 to-purple-500/20
                     border border-white/10 hover:bg-white/5 transition
                     flex items-center gap-3"
          type="button"
        >
          <span className="text-xl">🛒</span>
          <div className="text-left">
            <p className="font-bold leading-4">Carrito</p>
            <p className="text-sm text-gray-300">{cartCount} items</p>
          </div>
          <span className="ml-2 text-sm px-2 py-1 rounded-full bg-white/10 border border-white/10">
            {formatARS(total)}
          </span>
        </button>
      </div>


      {/* PROMOS DEL DIA */}
<div className="w-full">

  <div className="bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-white/10 rounded-2xl p-5 shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">🔥 Promos del día</h2>
        <p className="text-gray-300 text-sm mt-1">
          Combos rápidos para que el kiosco se sienta real (MVP).
        </p>
      </div>
      <span className="text-xs px-3 py-2 rounded-full bg-white/10 border border-white/10">
        -10% / -15%
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* Promo 1 */}
      <div className="bg-black/20 border border-white/10 rounded-2xl p-4 hover:bg-white/5 transition">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-bold">🥤 + 🍫 Combo Estudio</p>
            <p className="text-sm text-gray-300 mt-1">
              Energizante + Alfajor (10% OFF)
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">
            TOP
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-extrabold">$ 3.150</p>
          <button
            onClick={() => {
              // Energizante id: 6, Alfajor id: 1
              addToCart(6);
              addToCart(1);
            }}
            className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-400/30 hover:bg-blue-500/30 transition"
            type="button"
          >
            Agregar combo +
          </button>
        </div>
      </div>

      {/* Promo 2 */}
      <div className="bg-black/20 border border-white/10 rounded-2xl p-4 hover:bg-white/5 transition">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-bold">🧼 Pack Limpieza</p>
            <p className="text-sm text-gray-300 mt-1">
              Lavandina + Detergente (15% OFF)
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">
            NUEVO
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-extrabold">$ 3.500</p>
          <button
            onClick={() => {
              // Lavandina id: 7, Detergente id: 8
              addToCart(7);
              addToCart(8);
            }}
            className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/30 transition"
            type="button"
          >
            Agregar pack +
          </button>
        </div>
      </div>
    </div>
  </div>
</div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: CATEGORIES + SEARCH */}
        <div className="space-y-6">
          <div className="bg-gray-800/70 border border-white/10 rounded-2xl p-5 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Secciones</h2>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = c.key === activeCategory;
                return (
                  <button
                    key={c.key}
                    onClick={() => setActiveCategory(c.key)}
                    className={[
                      "px-4 py-2 rounded-xl border transition",
                      active
                        ? "bg-blue-500/25 border-blue-400/40"
                        : "bg-black/20 border-white/10 hover:bg-white/5",
                    ].join(" ")}
                    type="button"
                  >
                    <span className="mr-2">{c.emoji}</span>
                    {c.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400/40"
                placeholder="Buscar producto..."
              />
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Tip: esto es MVP visual. Después conectamos stock + pedidos reales.
            </p>
          </div>

          {/* CART PANEL (desktop) */}
          <div className="hidden lg:block sticky top-6">

            <CartPanel
              open={true}
              items={cartItems}
              total={total}
              onAdd={addToCart}
              onDec={decFromCart}
              onClear={clearCart}
              onConfirm={confirmOrder}
            />
          </div>
          
        </div>


        

        


        

        {/* CENTER: PRODUCTS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-800/40 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-300">
              {CATEGORIES.find((c) => c.key === activeCategory)?.emoji}{" "}
              <span className="font-semibold">
                {CATEGORIES.find((c) => c.key === activeCategory)?.label}
              </span>{" "}
              — elegí productos y armá tu pedido
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
           {filteredProducts.map((p) => {
  const outOfStock = (p.stock ?? 0) <= 0;
  const qtyInCart = cart[p.id] || 0;
  const reachedStock = qtyInCart >= (p.stock ?? 0);
const disabled = outOfStock || reachedStock;


  return (

              <div
                key={p.id}
                className="bg-gray-800/70 border border-white/10 rounded-2xl p-5 shadow-lg hover:bg-white/5 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold">{p.name}</p>

    {p.image_url ? (
  <img
    src={imgSrc(p.image_url)}

    alt={p.name}
    className="w-full h-36 object-cover rounded-2xl border border-white/10 mb-3"
  />
) : (
  <div className="w-full h-36 rounded-2xl border border-white/10 mb-3 bg-white/5 flex items-center justify-center text-gray-400 text-sm">
    Sin imagen
  </div>
)}





                    <p className="text-sm text-gray-300 mt-1">{p.description}</p>

                    <p className="text-xs text-gray-400 mt-2">  Stock: <span className="text-gray-200 font-semibold">{p.stock}</span></p>

                  </div>
                  {p.badge && <Badge>{p.badge}</Badge>}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xl font-extrabold">{formatARS(p.price)}</p>

            <button
  onClick={() => addToCart(p.id)}
  disabled={disabled}
  className={[
    "px-4 py-2 rounded-xl border transition",
    disabled
      ? "bg-gray-500/10 border-white/10 text-gray-500 cursor-not-allowed"
      : "bg-blue-500/20 border-blue-400/30 hover:bg-blue-500/30",
  ].join(" ")}
  type="button"
>
  {outOfStock ? "Sin stock" : reachedStock ? "Máx stock" : "Agregar +"}
</button>


                </div>

                {/* quick qty */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
                  <span>En carrito:</span>
                  <span className="font-semibold">{cart[p.id] || 0}</span>
                </div>
             </div>
  );
})}

          </div>
        </div>
      </div>

      {/* MOBILE CART DRAWER */}
      {openCart && (
        <div className="lg:hidden fixed inset-0 bg-black/60 flex items-end z-50">
          <div className="w-full bg-[#0b1220] border-t border-white/10 rounded-t-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xl font-bold">🛒 Tu carrito</p>
              <button
                onClick={() => setOpenCart(false)}
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/10"
                type="button"
              >
                Cerrar
              </button>
            </div>

            <CartPanel
              open={true}
              items={cartItems}
              total={total}
              onAdd={addToCart}
              onDec={decFromCart}
              onClear={clearCart}
              onConfirm={confirmOrder}
            />
          </div>
        </div>
      )}
      </div>


      {orderModal && (
  <OrderModal
    data={orderModal}
    onClose={() => setOrderModal(null)}
  />
)}

 



    </AppLayout>
  );
}

function CartPanel({ items, total, onAdd, onDec, onClear, onConfirm }) {
  return (
    <div className="bg-gray-800/70 border border-white/10 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">🛍️ Pedido</h2>
        <button
          onClick={onClear}
          className="text-sm px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
          type="button"
        >
          Vaciar
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-300 text-sm">
          Tu carrito está vacío. Agregá productos para armar tu pedido.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between gap-3 bg-black/20 border border-white/10 rounded-2xl p-3"
            >
              <div className="min-w-0">
                <p className="font-semibold truncate">{it.name}</p>
                <p className="text-xs text-gray-400">
                  {formatARS(it.price)} c/u · Subtotal:{" "}
                  <span className="text-gray-200">{formatARS(it.subtotal)}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <QtyButton onClick={() => onDec(it.id)}>-</QtyButton>
                <span className="w-6 text-center font-bold">{it.qty}</span>
                <QtyButton onClick={() => onAdd(it.id)}>+</QtyButton>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <p className="text-gray-300">Total</p>
            <p className="text-xl font-extrabold">{formatARS(total)}</p>
          </div>

          <button
            onClick={onConfirm}
            className="w-full mt-2 px-4 py-3 rounded-2xl
                       bg-gradient-to-r from-blue-500/25 to-purple-500/25
                       border border-blue-400/25 hover:bg-white/5 transition
                       font-bold"
            type="button"
          >
            Confirmar pedido ✅
          </button>
        </div>
      )}
    </div>
  );
}

function OrderModal({ data, onClose }) {
  const { itemsCount, total, eta, place } = data;

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 border-b border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold flex items-center gap-2">
                ✅ Pedido confirmado
              </h2>
              <p className="text-gray-300 text-sm mt-2">
                Tu pedido ya entró en cola. Te avisamos cuando esté listo.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
              type="button"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="bg-[#0b1220] p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-gray-400">Items</p>
              <p className="text-2xl font-extrabold mt-1">{itemsCount}</p>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-2xl font-extrabold mt-1">{formatARS(total)}</p>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-gray-400">Tiempo estimado</p>
              <p className="text-2xl font-extrabold mt-1">{eta}</p>
            </div>
          </div>

          <div className="mt-4 bg-black/20 border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-gray-400">Entrega</p>
            <p className="text-lg font-semibold mt-1">{place}</p>
            <p className="text-sm text-gray-300 mt-1">
              Podés retirarlo o pedir que lo bajen cuando esté listo.
            </p>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition font-semibold"
              type="button"
            >
              Seguir comprando
            </button>

            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500/25 to-purple-500/25
                         border border-blue-400/25 hover:bg-white/5 transition font-bold"
              type="button"
            >
              Ver mis pedidos 📦
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

