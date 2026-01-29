import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { formatARS } from "../utils/formatARS";
import VentaStatusBadge from "../components/ventas/VentaStatusBadge";
import { useVentas } from "../hooks/useVentas";

const STATUS = ["PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED"];

export default function AdminVentasPage() {
  const { user } = useAuth();
  const {
    orders,
    detail,
    filters,
    setFilters,
    loadOrders,
    loadDetail,
    changeStatus,
  } = useVentas();

  const [showDetailMobile, setShowDetailMobile] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const totalVendido = useMemo(
    () => orders.reduce((acc, o) => acc + Number(o.total || 0), 0),
    [orders]
  );

  return (
    <AppLayout>
      <div className="space-y-8 px-3 md:px-6 pb-16">

        {/* ================= HEADER (MISMO ESTILO ADMIN KIOSCO) ================= */}
        <div
          className="
            rounded-3xl
            bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/90
            border border-white/10
            px-6 py-6 md:px-8 md:py-8
          "
        >
          <h1
            className="
              text-4xl md:text-5xl font-extrabold
              bg-gradient-to-r from-cyan-400 to-purple-500
              bg-clip-text text-transparent
            "
          >
            Ventas · Pedidos
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Admin{" "}
            <span className="text-white font-semibold">
              {user?.name}
            </span>
          </p>
        </div>

        {/* ================= FILTROS ================= */}
        <div
          className="
            rounded-3xl p-5 md:p-6
            bg-white/5
            border border-white/10
            backdrop-blur-xl
            shadow-[0_0_30px_-12px_rgba(139,92,246,0.35)]
          "
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value }))
              }
              className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm outline-none"
            >
              <option value="">Estado</option>
              {STATUS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <input
              value={filters.userId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, userId: e.target.value }))
              }
              placeholder="User ID"
              className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm outline-none"
            />

            <input
              type="date"
              value={filters.from}
              onChange={(e) =>
                setFilters((f) => ({ ...f, from: e.target.value }))
              }
              className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm outline-none"
            />

            <input
              type="date"
              value={filters.to}
              onChange={(e) =>
                setFilters((f) => ({ ...f, to: e.target.value }))
              }
              className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm outline-none"
            />

            <button
              onClick={loadOrders}
              className="
                rounded-xl px-4 py-2
                bg-gradient-to-r from-indigo-500/40 to-purple-500/40
                border border-indigo-400/30
                font-semibold
                hover:brightness-125
                transition-all
              "
            >
              Aplicar
            </button>
          </div>
        </div>

        {/* ================= TABLA DESKTOP ================= */}
        <div className="hidden md:block bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <table className="w-full text-sm table-fixed">
            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="w-14 text-left py-3 px-2">#</th>
                <th className="w-24 text-left py-3 px-2">User</th>
                <th className="w-32 text-left py-3 px-2">Estado</th>
                <th className="w-20 text-right py-3 px-2">Items</th>
                <th className="w-32 text-right py-3 px-2">Total</th>
                <th className="text-left py-3 px-2">Fecha</th>
                <th className="w-24 text-right py-3 px-2"></th>
              </tr>
            </thead>

            <tbody className="text-gray-200">
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-3 px-2 font-semibold">#{o.id}</td>
                  <td className="py-3 px-2">{o.user_id}</td>
                  <td className="py-3 px-2">
                    <VentaStatusBadge status={o.status} />
                  </td>
                  <td className="py-3 px-2 text-right font-semibold">
                    {o.items_count ?? "—"}
                  </td>
                  <td className="py-3 px-2 text-right font-semibold">
                    {formatARS(o.total)}
                  </td>
                  <td className="py-3 px-2 text-gray-300">
                    {new Date(o.created_at).toLocaleString("es-AR")}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => loadDetail(o.id)}
                      className="
                        px-3 py-2 rounded-xl
                        bg-white/10 border border-white/10
                        hover:bg-white/20 transition
                      "
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="
                rounded-2xl p-4
                bg-gradient-to-br from-white/10 to-white/5
                border border-white/15
                backdrop-blur-xl
              "
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-lg">#{o.id}</p>
                  <p className="text-xs text-gray-400">
                    User {o.user_id}
                  </p>
                </div>
                <VentaStatusBadge status={o.status} />
              </div>

              <div className="mt-3 text-sm space-y-1">
                <p>Items: {o.items_count ?? "—"}</p>
                <p className="font-semibold">
                  {formatARS(o.total)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(o.created_at).toLocaleString("es-AR")}
                </p>
              </div>

              <button
                onClick={() => {
                  loadDetail(o.id);
                  setShowDetailMobile(true);
                }}
                className="
                  mt-4 w-full py-2 rounded-xl
                  bg-gradient-to-r from-indigo-500/40 to-purple-500/40
                  border border-indigo-400/30
                  font-semibold
                "
              >
                Ver detalle
              </button>
            </div>
          ))}
        </div>

        {/* ================= MOBILE DETAIL ================= */}
        {showDetailMobile && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setShowDetailMobile(false)}
            />

            <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-black border-t border-white/15 p-5 max-h-[85vh] overflow-y-auto">
              {!detail ? (
                <p className="text-center text-gray-400">Cargando...</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-xl font-bold">
                      Pedido #{detail.order.id}
                    </p>
                    <VentaStatusBadge status={detail.order.status} />
                  </div>

                  <p className="text-lg font-extrabold">
                    {formatARS(detail.order.total)}
                  </p>

                  <div className="space-y-2">
                    {detail.items.map((it) => (
                      <div key={it.id} className="flex justify-between text-sm">
                        <span>
                          {it.product_name} · x{it.qty}
                        </span>
                        <span className="font-semibold">
                          {formatARS(it.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3">
                    {STATUS.map((s) => (
                      <button
                        key={s}
                        onClick={() => changeStatus(s)}
                        className="py-2 rounded-xl bg-white/10 border border-white/15"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
