import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import CartPanel from "../components/kiosco/CartPanel";
import OrderModal from "../components/kiosco/OrderModal";
import ProductCard from "../components/kiosco/ProductCard";
import { formatARS } from "../utils/formatARS";
import PromosDelDia from "../components/kiosco/PromosDelDia";
import KioscoHeader from "../components/kiosco/KioscoHeader";
import KioscoFilters from "../components/kiosco/KioscoFilters";
import KioscoProductGrid from "../components/kiosco/KioscoProductGrid";
import { canUseFeature } from "../utils/permissions";
import { useSuscripcion } from "../hooks/useSuscripcion";
import { useNavigate } from "react-router-dom";

import { useKiosco } from "../hooks/useKiosco";

const CATEGORIES = [
  { key: "snacks", label: "Snacks", emoji: "🍫" },
  { key: "bebidas", label: "Bebidas", emoji: "🥤" },
  { key: "limpieza", label: "Limpieza", emoji: "🧼" },
];
//----------------------------------------------------------------------------------------
export default function KioscoPage() {
  const { user } = useAuth();
  const { suscripcion } = useSuscripcion();
  const navigate = useNavigate();
  

  const canUseKiosco = canUseFeature(
    { role: user?.role, suscripcion },
    "KIOSCO",
  );

  const {
    activeCategory,
    setActiveCategory,
    query,
    setQuery,
    cart,
    openCart,
    setOpenCart,
    products,
    cartItems,
    cartCount,
    total,
    addToCart,
    addComboToCart,
    decFromCart,
    clearCart,
    confirmOrder,
    orderModal,
    setOrderModal,
  } = useKiosco();

  //--------------------------------------------------------------------------------------

  return (
    <AppLayout>
      <div className="relative space-y-10">
        <KioscoHeader
          user={user}
          cartCount={cartCount}
          total={total}
          onToggleCart={() => setOpenCart((v) => !v)}
        />

        <PromosDelDia />

        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="flex flex-col gap-6 h-full">
              <KioscoFilters
                categories={CATEGORIES}
                activeCategory={activeCategory}
                onChangeCategory={setActiveCategory}
                query={query}
                onQueryChange={setQuery}
              />

              <div className="flex-1 flex flex-col">
                <CartPanel
                  items={cartItems}
                  total={total}
                  onAdd={addToCart}
                  onDec={decFromCart}
                  onClear={clearCart}
                  onConfirm={confirmOrder}
                />
              </div>
            </div>

            <KioscoProductGrid
              products={products}
              cart={cart}
              onAdd={addToCart}
              activeCategoryLabel={
                CATEGORIES.find((c) => c.key === activeCategory)?.label
              }
              activeCategoryEmoji={
                CATEGORIES.find((c) => c.key === activeCategory)?.emoji
              }
            />
          </div>
        </section>

        {/* MOBILE CART DRAWER */}
        {openCart && (
          <div className="lg:hidden fixed inset-0 bg-black/60 flex items-end z-50">
            <div className="w-full bg-[#0b1220] rounded-t-3xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <p className="text-xl font-bold">🛒 Tu carrito</p>
                <button
                  onClick={() => setOpenCart(false)}
                  className="px-3 py-2 rounded-xl bg-white/10 border border-white/10"
                >
                  Cerrar
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <CartPanel
                  items={cartItems}
                  total={total}
                  onAdd={addToCart}
                  onDec={decFromCart}
                  onClear={clearCart}
                  onConfirm={canUseKiosco ? confirmOrder : () => {}}
                />
              </div>
            </div>
          </div>
        )}

        {/* FLOATING CART BUTTON */}
        {cartCount > 0 && (
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setOpenCart(true)}
              className="flex items-center gap-3 px-5 py-4 rounded-full
              bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
              text-white font-bold"
            >
              🛒 {cartCount} {formatARS(total)}
            </button>
          </div>
        )}
        {!canUseKiosco && (
          <div
            className="
      fixed inset-0 z-[9999]
      bg-black/70 backdrop-blur-sm
      flex flex-col items-center justify-center
      text-center px-6
    "
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              🔒 Kiosco deshabilitado
            </h2>

            <p className="text-white/80 mb-4 max-w-md">
              Tu plan actual no incluye el módulo Kiosco. Activá un plan para
              vender dentro del consorcio.
            </p>

            <button
              onClick={() => navigate("/planes")}
              className="px-6 py-3 rounded-xl
        bg-gradient-to-r from-indigo-500 to-purple-600
        hover:opacity-90 transition
        text-white font-semibold"
            >
              Ver planes
            </button>
          </div>
        )}
      </div>{" "}
      {/* 🔥 ESTE ERA EL QUE FALTABA */}
      {orderModal && (
        <OrderModal data={orderModal} onClose={() => setOrderModal(null)} />
      )}
    </AppLayout>
  );
}
