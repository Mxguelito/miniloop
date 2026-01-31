export default function ConsorciosTable({ list, onEdit, onDelete }) {
  if (list.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-4">🏢</div>
        <p className="text-lg font-medium">
          No hay consorcios creados
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Creá el primero para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {list.map((c) => (
        <div
          key={c.id}
          className="
            bg-[#0f1e29]
            rounded-2xl
            p-4
            border border-white/10
            shadow-md
            transition
          "
        >
          {/* Nombre */}
          <h3 className="text-lg font-semibold text-white">
            {c.nombre}
          </h3>

          {/* Dirección */}
          <p className="text-sm text-gray-400 mt-1">
            {c.direccion}
          </p>

          {/* Unidades */}
          <div className="mt-3 inline-block">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
              {c.unidades} unidades
            </span>
          </div>

          {/* Acciones */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onEdit(c)}
              className="
                flex-1
                py-2
                rounded-xl
                text-blue-400
                bg-white/5
                hover:bg-white/10
                transition
              "
            >
              Editar
            </button>

            <button
              onClick={() => onDelete(c.id)}
              className="
                flex-1
                py-2
                rounded-xl
                text-red-400
                bg-white/5
                hover:bg-white/10
                transition
              "
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
