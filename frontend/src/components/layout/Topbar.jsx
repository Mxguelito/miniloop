import { useAuth } from "../../context/AuthContext";
import Badge from "../ui/Badge";

export default function Topbar({ onOpenMenu }) {
  const { user } = useAuth();

  return (
    <header
      className="
        w-full
        bg-gradient-to-r from-[#0b1220]/80 to-[#0f172a]/80
        backdrop-blur-xl
        border-b border-cyan-500/10
        px-4 py-3
        flex justify-between items-center
        relative
      "
    >
      {/* Glow decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-1/2 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full" />
        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-600/10 blur-2xl rounded-full" />
      </div>

      {/* IZQUIERDA */}
      <div className="relative z-10 flex items-center gap-3">
        {/* Botón menú FUTURISTA (solo mobile) */}
        <button
          onClick={onOpenMenu}
          className="
            md:hidden
            relative
            w-11 h-11
            rounded-2xl
            bg-gradient-to-br from-cyan-500/20 to-blue-600/20
            border border-cyan-400/30
            backdrop-blur-xl
            shadow-[0_0_20px_rgba(0,180,255,0.35)]
            hover:shadow-[0_0_35px_rgba(0,180,255,0.6)]
            transition-all
            active:scale-95
            flex items-center justify-center
          "
        >
          {/* Ícono hamburguesa custom */}
          <div className="flex flex-col gap-1.5">
            <span className="block w-6 h-0.5 bg-cyan-300 rounded-full" />
            <span className="block w-5 h-0.5 bg-cyan-400 rounded-full" />
            <span className="block w-6 h-0.5 bg-cyan-300 rounded-full" />
          </div>

          {/* Glow */}
          <span className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-xl -z-10" />
        </button>

        {/* Rol */}
        <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
          Rol:
          <Badge
            color={
              user.role === "ADMIN"
                ? "yellow"
                : user.role === "TESORERO"
                ? "green"
                : user.role === "PROPIETARIO"
                ? "blue"
                : "gray"
            }
          >
            {user.role}
          </Badge>
        </span>
      </div>

      {/* DERECHA */}
      <span className="relative z-10 text-sm font-semibold text-slate-100">
        {user.name}
      </span>
    </header>
  );
}
