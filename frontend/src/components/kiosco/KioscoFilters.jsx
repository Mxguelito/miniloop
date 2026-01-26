export default function KioscoFilters({
  categories,
  activeCategory,
  onChangeCategory,
  query,
  onQueryChange,
}) {
  return (
    <section
      className="
    relative
    rounded-3xl
    p-6
    bg-gradient-to-br
    from-white
    via-slate-50
    to-slate-100
    border border-slate-200
    shadow-lg
    space-y-5
  "
    >
      {/* HEADER */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          🧭 Secciones
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
            Filtrar
          </span>
        </h3>

        <p className="text-sm text-slate-500">
          Elegí una categoría para filtrar productos
        </p>
      </div>

      {/* CATEGORIES */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onChangeCategory(cat.key)}
            className={`
              px-4 py-2 rounded-full text-sm font-semibold transition
              ${
                activeCategory === cat.key
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
              }
            `}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Buscar por nombre o descripción…"
        className="
  w-full px-4 py-3 rounded-xl
  bg-white
  text-slate-900
  placeholder:text-slate-400
  border border-slate-200
  focus:bg-white
  focus:border-blue-400
  focus:outline-none
  focus:ring-2 focus:ring-blue-500
"
      />

      <p className="text-xs text-slate-400">
        Tip: buscá por nombre o descripción
      </p>
    </section>
  );
}
