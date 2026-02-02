import { useAuth } from "../../context/AuthContext";

/* =======================
   CARD BASE
======================= */
function StatCard({ title, value, subtitle, accent = "default" }) {
  const accents = {
    default: "bg-white/5 border-white/10",
    info: "bg-blue-500/10 border-blue-400/20",
    danger: "bg-red-500/10 border-red-400/20",
    success: "bg-green-500/10 border-green-400/20",
    warning: "bg-yellow-500/10 border-yellow-400/20",
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition
        ${accents[accent]}
        hover:bg-white/10
      `}
    >
      <span className="text-xs sm:text-sm text-white/60">
        {title}
      </span>

      <div className="text-2xl sm:text-3xl font-semibold text-white mt-1">
        {value}
      </div>

      {subtitle && (
        <span className="text-xs text-white/40 mt-1 block">
          {subtitle}
        </span>
      )}
    </div>
  );
}

/* =======================
   HOME STATS
======================= */
export default function HomeStats() {
  const { user } = useAuth();
  if (!user) return null;

  /* =======================
     ADMIN
  ======================= */
  if (user.role === "ADMIN") {
    return (
      <section className="mt-6 space-y-4">
        <h3 className="text-white font-semibold text-lg">
          📊 Estado del sistema
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard title="Usuarios" value="128" subtitle="Registrados" />
          <StatCard title="Consorcios" value="6" subtitle="Activos" />
          <StatCard title="Pedidos" value="42" subtitle="Este mes" />
          <StatCard
            title="Sistema"
            value="OK"
            subtitle="Sin alertas"
            accent="success"
          />
        </div>
      </section>
    );
  }

  /* =======================
     TESORERO
  ======================= */
  if (user.role === "TESORERO") {
    return (
      <section className="mt-6 space-y-4">
        <h3 className="text-white font-semibold text-lg">
          💰 Estado financiero
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard
            title="Deuda total"
            value="$1.250.000"
            subtitle="Expensas + multas"
            accent="danger"
          />
          <StatCard
            title="Recaudado"
            value="$980.000"
            subtitle="Este mes"
            accent="success"
          />
          <StatCard
            title="Deudores"
            value="5"
            subtitle="Unidades activas"
            accent="warning"
          />
          <StatCard
            title="Estado"
            value="ALERTA"
            subtitle="Pagos pendientes"
            accent="danger"
          />
        </div>
      </section>
    );
  }

  /* =======================
     PROPIETARIO / USER
  ======================= */
  if (user.role === "PROPIETARIO" || user.role === "USER") {
    return (
      <section className="mt-6 space-y-4">
       <div className="mb-6">
  <div className="flex items-center gap-3">
    <span className="text-xl">📊</span>
    <h3 className="text-xl font-semibold text-white">
      Transparencia del consorcio
    </h3>
  </div>

  <div className="mt-1 ml-8 h-[2px] w-24 bg-gradient-to-r from-blue-500/60 to-transparent rounded-full" />

  <p className="mt-2 ml-8 text-sm text-white/50 max-w-xl">
    Información clara y visible para todos los propietarios.
  </p>
</div>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Estado general"
            value="EN SEGUIMIENTO"
            subtitle="Gestión activa del consorcio"
            accent="info"
          />

          <StatCard
            title="Deuda total"
            value="$1.250.000"
            subtitle="Expensas y multas pendientes"
            accent="warning"
          />

          <StatCard
            title="Deudores activos"
            value="5"
            subtitle="Unidades con pagos atrasados"
            accent="warning"
          />
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            MiniLoop promueve la transparencia en la administración del
            consorcio. La información financiera se presenta de forma clara
            para que cada propietario pueda comprender el estado general y
            el destino de su contribución mensual.
          </p>
        </div>
      </section>
    );
  }

  return null;
}
