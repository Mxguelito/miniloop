import { motion } from "framer-motion";

export default function EstadoUnidad({
  estado,
  expensaActual,
  montoPagado,
  montoPendiente,
}) {
  const colorGlow =
    estado === "al_dia"
      ? "rgba(34,197,94,0.25)"
      : estado === "parcial"
      ? "rgba(234,179,8,0.25)"
      : "rgba(239,68,68,0.25)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        relative rounded-3xl p-6
        bg-[#020617]
        border border-white/10
        shadow-[0_0_40px_var(--glow)]
      "
      style={{ "--glow": colorGlow }}
    >
      {/* Glow */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"
        style={{ background: colorGlow }}
      />

      <h3 className="text-xl font-bold text-white mb-4">
        Estado de la unidad
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Expensa */}
        <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
          <p className="text-sm text-blue-300">Expensa del período</p>
          <p className="text-2xl font-bold mt-1 text-white">
            ${expensaActual.toLocaleString("es-AR")}
          </p>
        </div>

        {/* Pagado */}
        <div className="rounded-2xl p-4 bg-green-900/20 border border-green-700/30">
          <p className="text-sm text-green-300">Pagado</p>
          <p className="text-2xl font-bold mt-1 text-green-400">
            ${montoPagado.toLocaleString("es-AR")}
          </p>
        </div>

        {/* Pendiente */}
        <div className="rounded-2xl p-4 bg-red-900/20 border border-red-700/30">
          <p className="text-sm text-red-300">Pendiente</p>
          <p className="text-2xl font-bold mt-1 text-red-400">
            ${montoPendiente.toLocaleString("es-AR")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
