import { motion } from "framer-motion";

export default function InicioHeader({
  nombre,
  piso,
  dpto,
  periodo,
  estado,
  estadoPago,
  montoPendiente,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        relative overflow-hidden
        rounded-3xl
        bg-gradient-to-br from-[#020617] via-[#0b1220] to-[#020617]
        border border-white/10
        shadow-[0_0_60px_rgba(56,189,248,0.18)]
        p-8
      "
    >
      {/* Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />

      <h2 className="text-4xl font-extrabold tracking-tight text-white">
        Hola {nombre} 👋
      </h2>

      <p className="mt-2 text-blue-300">
        Unidad: Piso {piso ?? "-"} – Dpto {dpto ?? "-"}
      </p>

      <p className="mt-1 text-sm text-gray-400">
        Resumen de liquidación:{" "}
        <span className="text-white font-medium">{periodo}</span>
      </p>

      <p
        className={`mt-4 text-lg font-semibold ${
          estado === "al_dia" ? "text-green-400" : "text-red-400"
        }`}
      >
        {estado === "al_dia"
          ? "Estás al día ✔️"
          : `Debés $${montoPendiente.toLocaleString("es-AR")}`}
      </p>

      <span
        className={`inline-block mt-3 px-4 py-1 rounded-full text-xs font-semibold border
        ${
          estadoPago === "Pagada"
            ? "bg-green-900/40 text-green-400 border-green-700/40"
            : estadoPago === "Pago parcial"
            ? "bg-yellow-900/40 text-yellow-300 border-yellow-700/40"
            : "bg-red-900/40 text-red-400 border-red-700/40"
        }`}
      >
        {estadoPago}
      </span>
    </motion.div>
  );
}
