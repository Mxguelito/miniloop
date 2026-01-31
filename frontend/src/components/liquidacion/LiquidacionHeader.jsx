export default function LiquidacionHeader({
  data,
  onBack,
  onSave,
  onPublicar,
  onExportPDF,
}) {
  const estado = String(data.estado || "").toUpperCase();
  const cerrada = estado === "CERRADA";

  return (
    <div
      className="
        relative w-full mb-10 rounded-3xl
        bg-gradient-to-br from-[#0b1220] via-[#0e1628] to-[#0b1220]
        border border-cyan-500/10
        shadow-[0_0_50px_rgba(0,180,255,0.08)]
        overflow-hidden
      "
    >
      {/* GLOW DECORATIVO */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

      {/* CONTENIDO */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col gap-6">
        {/* HEADER SUPERIOR */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* INFO */}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white">
              Liquidación {data.mes}/{data.anio}
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Consorcio{" "}
              <span className="text-cyan-400 font-semibold">
                {data.consorcio_nombre || "—"}
              </span>
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Creada el{" "}
              {data.creado_en
                ? new Date(data.creado_en).toLocaleDateString("es-AR")
                : "—"}
            </p>
          </div>

          {/* ESTADO */}
          <div className="flex items-center">
            <span
              className={`
                px-4 py-1 rounded-full text-xs font-semibold tracking-wide
                ${
                  cerrada
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30"
                }
              `}
            >
              {cerrada ? "Liquidación cerrada" : "Borrador"}
            </span>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onBack}
            className="
              px-4 py-2 rounded-xl text-sm
              bg-gray-800/80 hover:bg-gray-700
              text-gray-200 transition
            "
          >
            ← Volver
          </button>

          <button
            onClick={onExportPDF}
            className="
              px-4 py-2 rounded-xl text-sm
              bg-gradient-to-r from-purple-600 to-fuchsia-500
              hover:opacity-90
              text-white shadow-lg transition
            "
          >
            Exportar PDF
          </button>

          {!cerrada && (
            <>
              <button
                onClick={onSave}
                className="
                  px-4 py-2 rounded-xl text-sm
                  bg-green-600 hover:bg-green-700
                  text-white shadow-lg transition
                "
              >
                Guardar
              </button>

              <button
                onClick={onPublicar}
                className="
                  px-4 py-2 rounded-xl text-sm
                  bg-cyan-600 hover:bg-cyan-700
                  text-white shadow-lg transition
                "
              >
                Publicar
              </button>
            </>
          )}

          {cerrada && (
            <span
              className="
                px-4 py-2 rounded-xl text-sm
                bg-green-500/10 text-green-400
                border border-green-500/30
              "
            >
              ✅ Solo lectura
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
