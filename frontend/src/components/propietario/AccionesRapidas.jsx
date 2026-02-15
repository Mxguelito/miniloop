import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CreditCard, FileText, ShoppingCart } from "lucide-react";
import { useSuscripcion } from "../../hooks/useSuscripcion";
import { canUseFeature } from "../../utils/permissions";
import { useState } from "react";
import UpgradeModal from "../modals/UpgradeModal";
import { useAuth } from "../../context/AuthContext";

export default function AccionesRapidas() {
  const navigate = useNavigate();
  const { data } = useSuscripcion();
  const { user } = useAuth();

  const estado = data?.estado;

  const [modalOpen, setModalOpen] = useState(false);
  const [featureBlocked, setFeatureBlocked] = useState(null);

  const acciones = [
    {
      label: "Pagar expensa",
      icon: CreditCard,
      color: "from-cyan-500 to-blue-600",
      requires: "PAGOS",
      onClick: () => alert("💳 Pago real próximamente"),
    },
    {
      label: "Ver liquidaciones",
      icon: FileText,
      color: "from-purple-500 to-indigo-600",
      requires: "MIS_LIQUIDACIONES",

 // 👈 AHORA SE CONTROLA
      onClick: () => navigate("/propietario/liquidaciones"),
    },
    {
      label: "Ir al kiosco",
      icon: ShoppingCart,
      color: "from-green-500 to-emerald-600",
      requires: "KIOSCO",
      onClick: () => navigate("/kiosco"),
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-white">Acciones rápidas</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {acciones.map((a) => {
            const Icon = a.icon;
            const canUse = canUseFeature(
              { role: user?.role, suscripcion: data },
              a.requires,
            );

            const handleClick = () => {
              if (canUse) {
                a.onClick();
              } else {
                setFeatureBlocked(a.requires);
                setModalOpen(true);
              }
            };

            return (
              <motion.button
                key={a.label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClick}
                className={`
                  relative overflow-hidden rounded-2xl p-6
                  bg-gradient-to-br ${a.color}
                  text-white font-semibold
                  shadow-[0_0_30px_rgba(0,0,0,0.4)]
                  ${!canUse ? "opacity-80" : ""}
                `}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 flex items-center gap-4">
                  <Icon className="w-7 h-7" />
                  <span className="text-lg">{a.label}</span>
                </div>

                {!canUse && (
                  <span className="absolute bottom-2 right-3 text-xs opacity-80">
                    Requiere plan activo
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <UpgradeModal
        open={modalOpen}
        feature={featureBlocked}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
