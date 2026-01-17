import { useAuth } from "../../context/AuthContext";
import Badge from "../ui/Badge";


export default function Topbar({ onOpenMenu }) {

  const { user } = useAuth();

  return (
    <header className="w-full bg-[#1e293b] p-4 border-b border-white/10 flex justify-between items-center">
  <div className="flex items-center gap-3">
    {/* Botón hamburguesa SOLO mobile */}
    <button
      onClick={onOpenMenu}
      className="md:hidden px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
    >
      ☰
    </button>

    <span className="text-lg flex items-center gap-2">
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

  <span className="text-lg font-semibold">{user.name}</span>
</header>

  );
}
