import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <div className="p-10 text-white">
      <h1 className="text-4xl font-bold mb-6">Panel Administrador</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gestión de usuarios */}
        <Link
          to="/admin/usuarios"
          className="bg-blue-600 hover:bg-blue-700 p-6 rounded-xl text-center text-xl font-semibold"
        >
          Gestión de Usuarios
        </Link>

        {/* Solicitudes unidad */}
        <Link
          to="/admin/solicitudes-unidad"
          className="bg-indigo-600 hover:bg-indigo-700 p-6 rounded-xl text-center text-xl font-semibold"
        >
          Solicitudes de Unidad
        </Link>

        {/* Kiosco - Productos */}
        <Link
          to="/admin/kiosco-productos"
          className="bg-purple-600 hover:bg-purple-700 p-6 rounded-xl text-center text-xl font-semibold"
        >
          Kiosco - Productos
        </Link>

        {/* Kiosco - Ventas */}
        <Link
          to="/admin/ventas"
          className="bg-red-600 hover:bg-red-700 p-6 rounded-xl text-center text-xl font-semibold"
        >
          Ventas / Pedidos
        </Link>

        {/* Consorcios */}
        <Link
          to="/admin/consorcios"
          className="bg-green-600 hover:bg-green-700 p-6 rounded-xl text-center text-xl font-semibold"
        >
          Consorcios
        </Link>

        {/* Finanzas */}
        <Link
          to="/admin/finanzas"
          className="bg-yellow-600 hover:bg-yellow-700 p-6 rounded-xl text-center text-xl font-semibold"
        >
          Finanzas
        </Link>
      </div>
    </div>
  );
}
