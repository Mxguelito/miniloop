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
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
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

  async function handleCreate() {
    if (!mes) {
      alert("Seleccioná un mes");
      return;
    }

    setSaving(true);

    try {
      const nueva = await createLiquidacion({
        mes: mesesNumero[mes],
        anio,
        consorcioId: user?.consorcioId || 1,
        monto_expensa: 0,
      });

      navigate(`/liquidaciones/${nueva.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout>
      <div className="relative max-w-xl mx-auto px-4 py-10">
        {/* GLOW BACKGROUND */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-cyan-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* HEADER */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Nueva liquidación
            </h1>
            <p className="text-cyan-200/80 mt-2 text-sm sm:text-base">
              Iniciá un nuevo período financiero del consorcio
            </p>
          </div>

          {/* CARD */}
          <div
            className="
              rounded-3xl
              p-6 sm:p-8
              bg-gradient-to-br
              from-[#07131c]
              via-[#0b2433]
              to-[#07131c]
              border border-cyan-500/30
              shadow-[0_0_50px_rgba(0,180,255,0.35)]
              backdrop-blur-xl
            "
          >
            {/* MES */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest text-cyan-200/70 mb-2">
                Mes
              </label>
              <select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="
                  w-full
                  bg-[#06121a]
                  text-cyan-100
                  px-5 py-4
                  rounded-2xl
                  border border-cyan-500/30
                  focus:outline-none
                  focus:ring-2 focus:ring-cyan-400/50
                  transition
                "
              >
                <option value="">Seleccionar mes…</option>
                {meses.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* AÑO */}
            <div className="mb-10">
              <label className="block text-xs uppercase tracking-widest text-cyan-200/70 mb-2">
                Año
              </label>
              <input
                type="number"
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
                className="
                  w-full
                  bg-[#06121a]
                  text-cyan-100
                  px-5 py-4
                  rounded-2xl
                  border border-cyan-500/30
                  focus:outline-none
                  focus:ring-2 focus:ring-cyan-400/50
                  transition
                "
              />
            </div>

            {/* CTA */}
            <button
              onClick={handleCreate}
              disabled={saving}
              className="
                w-full
                py-4
                rounded-2xl
                font-extrabold
                text-white
                bg-gradient-to-r from-cyan-500 to-blue-600
                shadow-[0_0_40px_rgba(0,180,255,0.6)]
                hover:scale-[1.03]
                hover:shadow-[0_0_65px_rgba(0,180,255,0.85)]
                active:scale-[0.97]
                transition-all
              "
            >
              {saving ? "Creando liquidación…" : "🚀 Crear liquidación"}
            </button>
          </div>

          {/* FOOT NOTE */}
          <p className="text-center text-xs text-cyan-200/50 mt-6">
            Todos los cálculos se generan automáticamente
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
