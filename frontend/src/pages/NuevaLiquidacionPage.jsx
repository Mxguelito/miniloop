

import AppLayout from "../components/layout/AppLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createLiquidacion } from "../services/liquidacionesService";
import { useAuth } from "../context/AuthContext";

export default function NuevaLiquidacionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [saving, setSaving] = useState(false);

  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];
const mesesNumero = {
  Enero: 1,
  Febrero: 2,
  Marzo: 3,
  Abril: 4,
  Mayo: 5,
  Junio: 6,
  Julio: 7,
  Agosto: 8,
  Septiembre: 9,
  Octubre: 10,
  Noviembre: 11,
  Diciembre: 12,
};

async function handleSave() {
  if (!mes) {
    alert("Seleccioná el mes");
    return;
  }

  const mesNumero = mesesNumero[mes]; 

  setSaving(true);

  const nueva = await createLiquidacion({
    mes: mesNumero,
    anio,
    consorcioId: user?.consorcioId || 1,
    monto_expensa: 15000 // TEMPORAL
  });

  setSaving(false);

  navigate(`/liquidaciones/${nueva.id}`);
}


  return (
    <AppLayout>
      <h1 className="text-3xl font-bold mb-6">Nueva Liquidación</h1>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-xl">
        
        <label className="block mb-2 text-gray-300">Mes</label>
        <select
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="w-full p-2 rounded bg-gray-900 text-gray-200 mb-4"
        >
          <option value="">Seleccionar…</option>
          {meses.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-gray-300">Año</label>
        <input
          type="number"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          className="w-full p-2 rounded bg-gray-900 text-gray-200 mb-6"
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white w-full"
        >
          {saving ? "Creando..." : "Crear liquidación"}
        </button>
      </div>
    </AppLayout>
  );
}
