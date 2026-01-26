import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";

const STATUS = ["PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED"];

function formatARS(n) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));
}

function Badge({ s }) {
  const map = {
    PENDING: "bg-yellow-500/15 border-yellow-400/20 text-yellow-200",
    PREPARING: "bg-blue-500/15 border-blue-400/20 text-blue-200",
    READY: "bg-purple-500/15 border-purple-400/20 text-purple-200",
    DELIVERED: "bg-green-500/15 border-green-400/20 text-green-200",
    CANCELLED: "bg-red-500/15 border-red-400/20 text-red-200",
  };
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full border ${map[s] || "bg-white/10 border-white/10"}`}
    >
      {s}
    </span>
  );
}

export default function AdminVentasPage() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  async function loadOrders() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (userId) params.set("user_id", userId);
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const res = await axiosInstance.get(
        `/kiosco/orders?${params.toString()}`,
      );
      setOrders(res.data);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error cargando pedidos");
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(id) {
    try {
      setLoadingDetail(true);
      setSelectedId(id);
      const res = await axiosInstance.get(`/kiosco/orders/${id}`);
      setDetail(res.data);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error cargando detalle");
    } finally {
      setLoadingDetail(false);
    }
  }

  async function changeStatus(newStatus) {
    if (!selectedId) return;
    try {
      await axiosInstance.patch(`/kiosco/orders/${selectedId}/status`, {
        status: newStatus,
      });
      await loadDetail(selectedId);
      await loadOrders();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error cambiando estado");
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const totalVendido = useMemo(
    () => orders.reduce((acc, o) => acc + Number(o.total || 0), 0),
    [orders],
  );

  const count = orders.length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">📦 Ventas / Pedidos</h1>
            <p className="text-gray-300 mt-2">
              Admin: <span className="font-semibold">{user?.name}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400">Pedidos</p>
              <p className="text-2xl font-extrabold">{count}</p>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400">Total (filtro)</p>
              <p className="text-2xl font-extrabold">
                {formatARS(totalVendido)}
              </p>
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <label className="text-xs text-gray-400">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
              >
                <option value="">Todos</option>
                {STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400">User ID</label>
              <input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="ej: 3"
                className="w-full mt-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">Desde</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full mt-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">Hasta</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full mt-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={loadOrders}
                className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500/25 to-purple-500/25
                           border border-blue-400/25 hover:bg-white/5 transition font-bold"
                type="button"
              >
                {loading ? "Cargando..." : "Aplicar filtros"}
              </button>
            </div>
          </div>
        </div>

        {/* TABLA + DETALLE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TABLA */}
          <div className="lg:col-span-2 bg-gray-800/60 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Pedidos</h2>
              <button
                onClick={() => {
                  setStatus("");
                  setUserId("");
                  setFrom("");
                  setTo("");
                  setTimeout(loadOrders, 0);
                }}
                className="text-sm px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
                type="button"
              >
                Limpiar
              </button>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-300">
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-2">#</th>
                    <th className="text-left py-2 pr-2">User</th>
                    <th className="text-left py-2 pr-2">Estado</th>
                    <th className="text-left py-2 pr-2">Items</th>
                    <th className="text-left py-2 pr-2">Total</th>

                    <th className="text-left py-2 pr-2">Fecha</th>
                    <th className="text-right py-2">Acción</th>
                  </tr>
                </thead>
                <tbody className="text-gray-200">
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-2 pr-2 font-semibold">#{o.id}</td>
                      <td className="py-2 pr-2">{o.user_id}</td>
                      <td className="py-2 pr-2">
                        <Badge s={o.status} />
                      </td>
                      <td className="py-2 pr-2 font-semibold">
                        {" "}
                        {o.items_count ?? "—"}
                      </td>

                      <td className="py-2 pr-2 font-semibold">
                        {formatARS(o.total)}
                      </td>
                      <td className="py-2 pr-2">
                        {new Date(o.created_at).toLocaleString("es-AR")}
                      </td>
                      <td className="py-2 text-right">
                        <button
                          onClick={() => loadDetail(o.id)}
                          className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
                          type="button"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}

                  {orders.length === 0 && !loading && (
                    <tr>
                      <td className="py-6 text-gray-400" colSpan={6}>
                        No hay pedidos con esos filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* DETALLE */}
          <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-5">
            <h2 className="text-xl font-bold mb-3">Detalle</h2>

            {!selectedId ? (
              <p className="text-gray-300 text-sm">
                Seleccioná un pedido para ver el detalle.
              </p>
            ) : loadingDetail ? (
              <p className="text-gray-300 text-sm">Cargando detalle...</p>
            ) : detail ? (
              <div className="space-y-4">
                <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">Pedido #{detail.order.id}</p>
                    <Badge s={detail.order.status} />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    User:{" "}
                    <span className="text-gray-200 font-semibold">
                      {detail.order.user_id}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Total:{" "}
                    <span className="text-gray-200 font-semibold">
                      {formatARS(detail.order.total)}
                    </span>
                  </p>
                  {detail.order.notes && (
                    <p className="text-xs text-gray-400 mt-1">
                      Notas:{" "}
                      <span className="text-gray-200">
                        {detail.order.notes}
                      </span>
                    </p>
                  )}
                </div>

                <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                  <p className="font-semibold mb-2">Items</p>
                  <div className="space-y-2">
                    {detail.items.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-200">
                          {it.product_name || `Prod ${it.product_id}`} · x
                          {it.qty}
                          <span className="text-gray-400">
                            {" "}
                            · {formatARS(it.price)} c/u
                          </span>
                        </span>
                        <span className="font-semibold">
                          {formatARS(it.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                  <p className="font-semibold mb-2">Cambiar estado</p>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUS.map((s) => (
                      <button
                        key={s}
                        onClick={() => changeStatus(s)}
                        className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition text-xs font-semibold"
                        type="button"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 text-sm">
                No se pudo cargar el detalle.
              </p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
