import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { getPlanes, createPlan } from "../services/planesService";

export default function AdminPlanesPage() {
  const [planes, setPlanes] = useState([]);
  const [nombre, setNombre] = useState("");

  async function load() {
    const data = await getPlanes();
    setPlanes(data);
  }

  async function handleCreate() {
    if (!nombre) return;
    await createPlan(nombre.toUpperCase());
    setNombre("");
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AppLayout>
      <div className="p-6 text-white space-y-6 max-w-xl">
        <h1 className="text-2xl font-bold">Planes del sistema</h1>

        <div className="flex gap-2">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: PREMIUM"
            className="flex-1 px-3 py-2 rounded bg-black/30 border border-white/10"
          />
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
          >
            Crear
          </button>
        </div>

        <ul className="space-y-2">
          {planes.map((p) => (
            <li
              key={p.id}
              className="p-3 rounded bg-white/5 border border-white/10"
            >
              #{p.id} — {p.nombre}
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
