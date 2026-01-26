import { formatARS } from "../../utils/formatARS";

export default function KioscoHeader({ user, cartCount, total, onToggleCart }) {
  return (
    <header
      className="
        relative
        overflow-hidden
        rounded-3xl
        border border-white/10
        bg-gradient-to-br from-[#0b1220] via-[#0e1628] to-[#0b1220]
        px-6 py-6 md:px-10 md:py-8
        flex flex-col gap-6
        md:flex-row md:items-center md:justify-between
        shadow-xl
      "
    >
      {/* DECORATIVE GLOW */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full" />

      {/* LEFT: TITLE */}
      <div className="relative z-10 space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <span className="text-4xl md:text-5xl">🛒</span>
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Kiosco del Consorcio
          </span>
        </h1>

        <p className="text-sm md:text-base text-slate-300">
          Compras internas rápidas
          {user?.name && (
            <>
              {" · "}
              <span className="font-semibold text-slate-200">
                {user.name}
              </span>
            </>
          )}
        </p>
      </div>

      {/* RIGHT: CART */}
      <button
        onClick={onToggleCart}
        type="button"
        className="
          relative z-10
          flex items-center gap-4
          px-5 py-4
          rounded-2xl
          bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
          text-white
          shadow-2xl shadow-purple-500/40
          hover:scale-[1.03]
          active:scale-95
          transition
          self-start md:self-auto
        "
      >
        <span className="text-2xl">🛒</span>

        <div className="text-left leading-tight">
          <p className="text-sm font-bold uppercase tracking-wide">
            Carrito
          </p>
          <p className="text-xs opacity-90">
            {cartCount} ítem{cartCount !== 1 && "s"}
          </p>
        </div>

        <span className="ml-2 text-sm font-extrabold px-3 py-1 rounded-full bg-white/20 backdrop-blur">
          {formatARS(total)}
        </span>
      </button>
    </header>
  );
}
