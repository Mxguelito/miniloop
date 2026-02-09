import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function FakeCheckoutModal({ open, onClose, plan, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!open || !plan) return null;


  const handlePay = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => {
        onSuccess(); // activa suscripción
        onClose();
        setDone(false);
      }, 1200);
    }, 1800);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md rounded-2xl bg-[#0b1220] border border-white/10 p-6 text-white"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <h2 className="text-xl font-semibold mb-2">Confirmar pago</h2>
          <p className="text-white/70 mb-4">
            Plan <b>{plan.nombre}</b> — ${plan.precio}/mes
          </p>

          {!loading && !done && (
            <button
              onClick={handlePay}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition font-semibold"
            >
              Pagar ahora
            </button>
          )}

          {loading && (
            <div className="text-center py-6 text-white/80">
              Procesando pago…
            </div>
          )}

          {done && (
            <div className="text-center py-6 text-emerald-400 font-semibold">
              ✔ Pago exitoso
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-4 w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
          >
            Cancelar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
