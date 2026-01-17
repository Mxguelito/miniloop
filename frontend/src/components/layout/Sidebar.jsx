import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import HomeIcon from "../icons/HomeIcon";
import DashboardIcon from "../icons/DashboardIcon";
import LiquidacionIcon from "../icons/LiquidacionIcon";
import UnidadIcon from "../icons/UnidadIcon";
import Button from "../ui/Button";
import KioscoIcon from "../icons/KioscoIcon";


export default function Sidebar({ mobile = false, onNavigate }) {

  const { user, logout } = useAuth();

  const baseClass =
  "bg-[#1e293b] p-6 flex flex-col border-r border-white/10";

  return (
     <aside
    className={
      mobile
        ? `${baseClass} w-full h-full`
        : `${baseClass} w-64 hidden md:flex`
    }
  >
      <h2 className="text-3xl font-extrabold mb-10 text-blue-400 tracking-wide">
        Miniloop
      </h2>

      <nav className="flex flex-col gap-2 text-lg">
        {/* HOME GLOBAL */}
        <SidebarItem to="/dashboard" icon={<DashboardIcon />}>
          Home
        </SidebarItem>

        {/* KIOSCO (GLOBAL) */}
<SidebarItem to="/kiosco" icon={<KioscoIcon />}>
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
            >
              Mis liquidaciones
            </SidebarItem>
            <SidebarItem to="/mi-unidad" icon={<UnidadIcon />}>
              Mi unidad
            </SidebarItem>
          </>
        )}

        {/* INQUILINO (si lo usás más adelante) */}
        {user.role === "INQUILINO" && (
          <SidebarItem to="/mi-unidad" icon={<UnidadIcon />}>
            Mi unidad
          </SidebarItem>
        )}
      </nav>

     <Button
  variant="danger"
  onClick={logout}
  className="mt-auto w-full"
>
  Cerrar sesión
</Button>

    </aside>
  );
}

//  mini componente para cada item del menú
function SidebarItem({ to, icon, children }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition"
    >
      <span className="w-6">{icon}</span>
      {children}
    </Link>
  );
}
