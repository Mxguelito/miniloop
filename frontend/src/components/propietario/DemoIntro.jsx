import { motion } from "framer-motion";
import { Building2, ShieldCheck } from "lucide-react";

export default function DemoIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        relative overflow-hidden
        rounded-3xl
        bg-gradient-to-br from-[#020617] via-[#0b1220] to-[#020617]
        border border-white/10
        p-6 md:p-8
        shadow-[0_0_60px_rgba(56,189,248,0.15)]
      "
    >
      {/* Glow decorativo */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />

      {/* Contenido */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-7 h-7 text-cyan-400" />
          <h3 className="text-2xl font-extrabold tracking-tight text-white">
            Todo tu consorcio, en un solo lugar
          </h3>
        </div>

        <p className="text-sm md:text-base text-blue-200/80 max-w-2xl">
          Consultá tus expensas, pagos y servicios de forma clara y ordenada.
          MiniLoop simplifica la gestión diaria tanto para propietarios como
          para administradores, sin papeles ni confusión.
        </p>

        <div className="flex items-center gap-2 text-sm text-green-300 font-medium">
          <ShieldCheck className="w-4 h-4" />
          Información clara, transparente y siempre actualizada
        </div>
      </div>
    </motion.div>
  );
}
