import { useAuth } from "../../context/AuthContext";
import Badge from "../ui/Badge";


export default function Topbar({ onOpenMenu }) {

  const { user } = useAuth();

  return (
    <header className="w-full bg-[#111827]/80 backdrop-blur-md p-4 flex justify-between items-center">

  <div className="flex items-center gap-3">
    {/* Botón hamburguesa SOLO mobile */}
    <button
      onClick={onOpenMenu}
      className="md:hidden px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
    >
      ☰
    </button>

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

  <span className="text-sm font-semibold text-slate-100">{user.name}</span>

</header>

  );
}
