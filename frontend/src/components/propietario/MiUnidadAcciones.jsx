export default function MiUnidadAcciones({
  onEditarTelefono,
  onSolicitarCambioUnidad,
}) {
  return (
    <div
      className="
        rounded-3xl
        bg-white/5
        backdrop-blur-xl
        border
        border-white/10
        p-6
        space-y-4
        shadow-[0_0_60px_rgba(56,189,248,0.15)]
      "
    >
      <h2 className="text-lg font-semibold text-white">
        Acciones
      </h2>

      <button
        onClick={onEditarTelefono}
        className="
          w-full
          rounded-2xl
          py-3
          text-sm
          font-semibold
          text-black
          bg-gradient-to-r from-cyan-400 to-sky-400
          hover:from-cyan-300 hover:to-sky-300
          transition
          shadow-[0_0_30px_rgba(56,189,248,0.5)]
        "
      >
        Editar teléfono
      </button>

      <button
        onClick={onSolicitarCambioUnidad}
        className="
          w-full
          rounded-2xl
          py-3
          text-sm
          font-medium
          text-white
          border
          border-cyan-400/40
          hover:bg-cyan-400/10
          transition
        "
      >
        Solicitar cambio de unidad
      </button>
    </div>
  );
}
