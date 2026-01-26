import { formatARS } from "../../utils/formatARS";

function QtyButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 hover:bg-gray-200 transition text-gray-700 font-bold"
      type="button"
    >
      {children}
    </button>
  );
}

export default function CartPanel({
  items,
  total,
  onAdd,
  onDec,
  onClear,
  onConfirm,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-900">🛍️ Pedido</h2>
        <button
          onClick={onClear}
          className="text-sm px-3 py-2 rounded-xl bg-gray-100 border border-gray-200 hover:bg-gray-200 transition text-gray-700"
          type="button"
        >
          Vaciar
        </button>
      </div>

      {/* EMPTY */}
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Tu carrito está vacío. Agregá productos para armar tu pedido.
        </p>
      ) : (
        <div className="space-y-3">
          {/* ITEMS */}
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-3"
            >
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {it.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatARS(it.price)} c/u · Subtotal{" "}
                  <span className="font-semibold text-gray-700">
                    {formatARS(it.subtotal)}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <QtyButton onClick={() => onDec(it.id)}>-</QtyButton>
                <span className="w-6 text-center font-bold text-gray-800">
                  {it.qty}
                </span>
                <QtyButton onClick={() => onAdd(it.id)}>+</QtyButton>
              </div>
            </div>
          ))}

          {/* TOTAL */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <p className="text-gray-600">Total</p>
            <p className="text-xl font-extrabold text-gray-900">
              {formatARS(total)}
            </p>
          </div>

          {/* CONFIRM */}
          <button
            onClick={onConfirm}
            className="w-full mt-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-bold"
            type="button"
          >
            Confirmar pedido ✅
          </button>
        </div>
      )}
    </div>
  );
}
