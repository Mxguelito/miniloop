import { motion } from "framer-motion";
import { useState } from "react";
import { useConsorcios } from "../../hooks/useConsorcios";

export default function AsignarConsorcioModal({
  open,
  user,
  onClose,
  onConfirm,
}) {
  if (!open || !user) return null;

  const { list: consorcios } = useConsorcios();

  // =========================
  // ESTADO INTERNO
  // =========================
  const [modo, setModo] = useState("existente"); // existente | nuevo
  const [consorcioId, setConsorcioId] = useState("");
  const [nombreConsorcio, setNombreConsorcio] = useState("");

  // =========================

  // =========================
  // CONFIRMAR
  // =========================
  const handleConfirm = () => {
    if (modo === "existente") {
      onConfirm({
        userId: user.id,
        consorcioId,
      });
    } else {
      onConfirm({
        userId: user.id,
        nuevoConsorcio: {
          nombre: nombreConsorcio,
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="
      relative z-10 w-full max-w-md
      rounded-3xl
      bg-gradient-to-br from-[#0b1220] to-[#020617]
      border border-white/10
      shadow-[0_0_40px_rgba(59,130,246,0.35)]
      text-white
      p-6
    "
      >
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl font-bold">Aprobar usuario</h2>
          <p className="text-sm text-gray-400 mt-1">
            Asigná un consorcio para habilitar el acceso
          </p>
        </div>

        {/* Usuario */}
        <div className="mb-5 rounded-xl bg-white/5 p-4 border border-white/10">
          <p className="text-sm">
            <span className="text-gray-400">Usuario:</span>{" "}
            <span className="font-semibold">{user.nombre}</span>
          </p>
          <p className="text-sm text-gray-300 truncate">{user.email}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
            {user.role}
          </span>
        </div>

        {/* Modo */}
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
            <input
              type="radio"
              checked={modo === "existente"}
              onChange={() => setModo("existente")}
            />
            <span className="text-sm">Asignar a consorcio existente</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
            <input
              type="radio"
              checked={modo === "nuevo"}
              onChange={() => setModo("nuevo")}
            />
            <span className="text-sm">Crear nuevo consorcio</span>
          </label>
        </div>

        {/* EXISTENTE */}
        {modo === "existente" && (
          <div className="mt-4">
            <label className="text-sm text-gray-400">Consorcio</label>
            <select
              value={consorcioId}
              onChange={(e) => setConsorcioId(e.target.value)}
              className="
            w-full mt-2 p-3 rounded-xl
            bg-[#0b1220]
            border border-white/10
            text-white
          "
            >
              <option value="">Elegir consorcio</option>
              {consorcios.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* NUEVO */}
        {modo === "nuevo" && (
          <div className="mt-4">
            <label className="text-sm text-gray-400">
              Nombre del consorcio
            </label>
            <input
              value={nombreConsorcio}
              onChange={(e) => setNombreConsorcio(e.target.value)}
              placeholder="Ej: Torre Palermo"
              className="
            w-full mt-2 p-3 rounded-xl
            bg-[#0b1220]
            border border-white/10
            text-white
          "
            />
          </div>
        )}

        {/* Acciones */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="
          w-full py-3 rounded-xl
          bg-white/5 border border-white/10
          text-gray-300
          hover:bg-white/10
          transition
        "
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            className="
          w-full py-3 rounded-xl
          bg-green-600 hover:bg-green-500
          font-semibold
          transition
        "
          >
            Confirmar y aprobar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
