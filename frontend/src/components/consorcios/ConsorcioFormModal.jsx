export default function ConsorcioFormModal({
  form,
  setForm,
  editing,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="
          w-full
          sm:max-w-md
          bg-[#0f1e29]/95
          backdrop-blur-xl
          rounded-t-2xl sm:rounded-2xl
          p-5 sm:p-6
          border border-white/10
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white">
            {editing ? "Editar consorcio" : "Nuevo consorcio"}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Completá los datos del edificio
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Nombre del consorcio"
            value={form.nombre}
            onChange={(e) =>
              setForm({ ...form, nombre: e.target.value })
            }
            className="
              w-full
              p-3
              rounded-xl
              bg-[#09131b]
              text-white
              focus:outline-none
              focus:ring-2 focus:ring-cyan-500/40
            "
            required
          />

          <input
            type="text"
            placeholder="Dirección"
            value={form.direccion}
            onChange={(e) =>
              setForm({ ...form, direccion: e.target.value })
            }
            className="
              w-full
              p-3
              rounded-xl
              bg-[#09131b]
              text-white
              focus:outline-none
              focus:ring-2 focus:ring-cyan-500/40
            "
            required
          />

          <input
            type="number"
            placeholder="Cantidad de unidades"
            value={form.unidades}
            onChange={(e) =>
              setForm({ ...form, unidades: e.target.value })
            }
            className="
              w-full
              p-3
              rounded-xl
              bg-[#09131b]
              text-white
              focus:outline-none
              focus:ring-2 focus:ring-cyan-500/40
            "
            required
          />

          {/* Acciones */}
          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1
                py-3
                rounded-xl
                text-gray-300
                bg-white/5
                hover:bg-white/10
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="
                flex-1
                py-3
                rounded-xl
                text-white font-medium
                bg-gradient-to-r from-blue-600 to-cyan-500
                hover:opacity-90
                shadow-lg
              "
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
