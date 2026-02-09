import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import HomeIcon from "../icons/HomeIcon";
import DashboardIcon from "../icons/DashboardIcon";
import LiquidacionIcon from "../icons/LiquidacionIcon";
import UnidadIcon from "../icons/UnidadIcon";
import Button from "../ui/Button";
import KioscoIcon from "../icons/KioscoIcon";
import { useLocation } from "react-router-dom";
import { useSuscripcion } from "../../hooks/useSuscripcion";
import { canUseFeature } from "../../utils/permissions";

export default function Sidebar({ mobile = false, onNavigate }) {
  const { data: suscripcion } = useSuscripcion();

  const { user, logout } = useAuth();

  const location = useLocation();

  const canUse = (feature) =>
    canUseFeature({ role: user?.role, suscripcion }, feature);

  // 👉 BASE DEL SIDEBAR (ACÁ VA EL BASECLASS)
  const baseClass =
    "bg-[#111827] p-6 flex flex-col h-full shadow-xl shadow-black/30";

  return (
    <aside
      className={
        mobile
          ? `${baseClass} w-full`
          : `${baseClass} w-64 hidden md:flex m-4 rounded-2xl`
      }
    >
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-400 tracking-tight">
          Miniloop
        </h2>
      </div>

      {/* NAV (SCROLLEABLE) */}
      <nav className="flex-1 flex flex-col gap-1 text-sm font-medium text-slate-300 overflow-y-auto pr-1">
        {/* HOME GLOBAL */}
        <SidebarItem to="/dashboard" icon={<DashboardIcon />}>
          Home
        </SidebarItem>

        {/* KIOSCO */}
        <SidebarItem
          to="/kiosco"
          icon={<KioscoIcon />}
          disabled={!canUse("KIOSCO")}
        >
          Kiosco
        </SidebarItem>

        {/* ADMIN */}
        {user.role === "ADMIN" && (
          <>
            <SidebarItem to="/admin" icon={<DashboardIcon />}>
              Panel Admin
            </SidebarItem>

            <SidebarItem to="/admin/usuarios" icon={<HomeIcon />}>
              Usuarios
            </SidebarItem>

            <SidebarItem to="/admin/kiosco-productos" icon={<KioscoIcon />}>
              Kiosco - Productos
            </SidebarItem>

            <SidebarItem to="/admin/ventas" icon={<LiquidacionIcon />}>
              Ventas / Pedidos
            </SidebarItem>

            <SidebarItem to="/consorcios" icon={<HomeIcon />}>
              Consorcios
            </SidebarItem>
          </>
        )}

        {/* TESORERO */}
        {user.role === "TESORERO" && (
          <>
            <SidebarItem to="/tesorero" icon={<DashboardIcon />}>
              Mi panel
            </SidebarItem>
            <SidebarItem to="/liquidaciones" icon={<LiquidacionIcon />}>
              Liquidaciones
            </SidebarItem>
          </>
        )}

        {/* PROPIETARIO */}
        {user.role === "PROPIETARIO" && (
          <>
            <SidebarItem to="/propietario" icon={<HomeIcon />}>
              Inicio
            </SidebarItem>

            <SidebarItem
              to="/propietario/liquidaciones"
              icon={<LiquidacionIcon />}
              disabled={!canUse("VIEW_INFO")}
            >
              Mis liquidaciones
            </SidebarItem>

            <SidebarItem to="/mi-unidad" icon={<UnidadIcon />}>
              Mi unidad
            </SidebarItem>
          </>
        )}

        {/* INQUILINO */}
        {user.role === "INQUILINO" && (
          <SidebarItem to="/mi-unidad" icon={<UnidadIcon />}>
            Mi unidad
          </SidebarItem>
        )}
      </nav>

      {/* FOOTER FIJO */}
      <div className="pt-4">
        <Button
          variant="danger"
          onClick={logout}
          className="w-full text-sm font-medium"
        >
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}

// ITEM DEL SIDEBAR
function SidebarItem({ to, icon, children, disabled = false }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (disabled) {
    return (
      <div
        className="
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
          text-slate-500 cursor-not-allowed opacity-60
        "
      >
        <span className="w-6 flex justify-center">{icon}</span>
        {children}
        <span className="ml-auto text-xs opacity-70">Plan requerido</span>
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium tracking-tight transition
        ${
          isActive
            ? "bg-blue-500/15 text-blue-400 shadow-inner shadow-blue-500/20"
            : "text-slate-300 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      <span className="w-6 flex justify-center">{icon}</span>
      {children}
    </Link>
  );
}
