import ProductCard from "./ProductCard";

export default function KioscoProductGrid({
  products,
  cart,
  onAdd,
  activeCategoryEmoji,
  activeCategoryLabel,
}) {
  return (
    <div className="lg:col-span-2">
      {/* CONTENEDOR VISUAL */}
      <div className="space-y-4">
        {/* HEADER DE CATEGORÍA */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{activeCategoryEmoji}</span>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {activeCategoryLabel}
              </h2>
              <p className="text-sm text-slate-500">Productos disponibles</p>
            </div>
          </div>
        </div>

        {/* GRID DE PRODUCTOS */}
        <div className="max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                qtyInCart={cart[p.id] || 0}
                onAdd={onAdd}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
