import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function UpgradeModal({ open, onClose, feature }) {
  const navigate = useNavigate();

  if (!open) return null;

  const featuresCopy = {
    PAGOS: {
      title: "Pagos online de expensas",
      desc: "Permití a los propietarios pagar expensas de forma digital, rápida y sin conflictos.",
      benefits: [
        "Pagos 100% online",
        "Historial automático",
        "Menos discusiones y errores",
      ],
    },
    KIOSCO: {
      title: "Acceso al Kiosco",
      desc: "Compras y servicios centralizados para el consorcio.",
      benefits: [
        "Pedidos internos",
        "Seguimiento de compras",
        "Servicios externos integrados",
      ],
    },
      MIS_LIQUIDACIONES: {
    title: "Historial de liquidaciones",
    desc: "Accedé al detalle completo de tus liquidaciones mensuales.",
    benefits: [
      "Resumen por período",
      "Detalle de expensas",
      "Historial completo",
    ],
  },
  };

 const data =
  featuresCopy[feature] || {
    title: "Función premium",
    desc: "Esta función requiere un plan superior.",
    benefits: [],
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0f172a] rounded-2xl p-6 w-full max-w-md text-white shadow-2xl"
      >
        <h2 className="text-xl font-bold mb-2">
          🔒 Función premium
        </h2>

        <p className="text-sm text-slate-300 mb-4">
          <strong>{data.title}</strong><br />
          {data.desc}
        </p>

        <ul className="text-sm space-y-2 mb-6">
          {data.benefits.map((b) => (
            <li key={b}>✔ {b}</li>
          ))}
        </ul>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Más tarde
          </button>

          <button
            onClick={() => navigate("/planes")}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            Ver planes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
