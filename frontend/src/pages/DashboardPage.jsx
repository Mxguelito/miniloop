import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getUsers } from "../services/usersService";
import { getConsorcios } from "../services/consorciosService";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { user } = useAuth();

  const [userCount, setUserCount] = useState(0);
  const [consorcioCount, setConsorcioCount] = useState(0);

  useEffect(() => {
    const users = getUsers();
    const consorcios = getConsorcios();

    setUserCount(users.length);
    setConsorcioCount(consorcios.length);
  }, []);

  const stats = [
    { title: "Usuarios registrados", value: userCount },
    { title: "Consorcios activos", value: consorcioCount },
    { title: "Liquidaciones del mes", value: 18 },
    { title: "Total recaudado", value: "$420.000" },
  ];

  return (
    <AppLayout>
      <h1 className="text-4xl font-bold mb-2">Bienvenido, {user.name}</h1>
      <p className="text-xl text-gray-300 mb-10">
        Tu rol es: <span className="font-semibold">{user.role}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((s) => (
          <div
            key={s.title}
            className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:bg-gray-700 transition"
          >
            <h3 className="text-gray-400 text-sm">{s.title}</h3>
            <p className="text-3xl font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Últimas actividades</h2>

        <ul className="space-y-3 text-gray-300">
          <li> Nuevo usuario registrado: Juan Pérez</li>
          <li>Liquidación del Consorcio “Las Rosas” generada</li>
          <li>Pago registrado del propietario #203</li>
        </ul>
      </div>
      <div className="mt-8">
        <Link
          to="/kiosco"
          className="block bg-gradient-to-r from-blue-500/20 to-purple-500/20
               border border-white/10 rounded-xl p-6 hover:bg-white/5 transition"
        >
          <h2 className="text-2xl font-bold">🛒 Kiosco del Consorcio</h2>
          <p className="text-gray-300 mt-2">
            Comprá snacks, bebidas y artículos sin salir. Pedidos internos
            rápidos.
          </p>
          <div className="mt-4 inline-flex px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
            Abrir kiosco
          </div>
        </Link>
      </div>
    </AppLayout>
  );
}
