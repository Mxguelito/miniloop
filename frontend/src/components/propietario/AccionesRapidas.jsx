import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CreditCard, FileText, ShoppingCart } from "lucide-react";

export default function AccionesRapidas() {
  const navigate = useNavigate();

  const acciones = [
    {
      label: "Pagar expensa",
      icon: CreditCard,
      color: "from-cyan-500 to-blue-600",
      onClick: () => alert("💳 Integrar pago próximamente"),
    },
    {
      label: "Ver liquidaciones",
      icon: FileText,
      color: "from-purple-500 to-indigo-600",
      onClick: () => navigate("/propietario/liquidaciones"),
    },
    {
      label: "Ir al kiosco",
      icon: ShoppingCart,
      color: "from-green-500 to-emerald-600",
      onClick: () => navigate("/kiosco"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-bold text-white">
        Acciones rápidas
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {acciones.map((a) => {
          const Icon = a.icon;
          return (
            <motion.button
              key={a.label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={a.onClick}
              className={`
                relative overflow-hidden rounded-2xl p-6
                bg-gradient-to-br ${a.color}
                text-white font-semibold
                shadow-[0_0_30px_rgba(0,0,0,0.4)]
              `}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10 flex items-center gap-4">
                <Icon className="w-7 h-7" />
                <span className="text-lg">{a.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
