import { formatARS } from "../../utils/formatARS";

export default function OrderModal({ data, onClose }) {
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
              <p className="text-2xl font-extrabold mt-1">
                {formatARS(total)}
              </p>
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
