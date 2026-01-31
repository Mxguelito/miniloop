export default function ConsorciosHeader({ onNew }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Consorcios
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Administrá edificios y unidades
        </p>
      </div>

      <button
        onClick={onNew}
        className="
          w-full sm:w-auto
          py-3 px-5
          rounded-xl
          text-white font-medium
          bg-gradient-to-r from-blue-600 to-cyan-500
          hover:opacity-90
          shadow-lg
          transition
        "
      >
        + Nuevo consorcio
      </button>
    </div>
  );
}
