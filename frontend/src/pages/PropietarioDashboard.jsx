import AppLayout from "../components/layout/AppLayout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Loader2 } from "lucide-react";
import StatBox from "../components/ui/StatBox";
import Card from "../components/ui/Card";
import InicioHeader from "../components/propietario/InicioHeader";
import EstadoUnidad from "../components/propietario/EstadoUnidad";
import AccionesRapidas from "../components/propietario/AccionesRapidas";
import AnimatedSection from "../components/ui/AnimatedSection";
import DemoIntro from "../components/propietario/DemoIntro";

export default function PropietarioDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axiosInstance.get("/propietarios/me");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
        </div>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout>
        <div className="text-center text-red-400 font-semibold mt-10">
          No se encontraron datos del propietario.
        </div>
      </AppLayout>
    );
  }

  //  FIX: VALORES SEGUROS

  const montoPendiente = data.montoPendiente ?? 0;
  const expensaActual = data.expensaActual ?? 0;
  const montoPagado = data.montoPagado ?? 0;

  const estado = montoPendiente === 0 ? "al_dia" : "deuda";

  // === NUEVO: Mes/Año para mostrar contexto ===
  // si backend no manda mes/anio, esto queda "—"
  const mes = data.mes ?? data.mesActual ?? null;
  const anio = data.anio ?? data.anioActual ?? null;

  const periodoLabel =
    mes && anio ? `${String(mes).padStart(2, "0")}/${anio}` : "—";

  // === NUEVO: Estado de pago (para badge) ===
  let estadoPago = "Pendiente";
  if (montoPendiente === 0) estadoPago = "Pagada";
  else if (montoPagado > 0) estadoPago = "Pago parcial";

  return (
    <AppLayout>
      <div className="p-6 space-y-10 text-white">
        <AnimatedSection delay={0}>
          <DemoIntro />
        </AnimatedSection>
        {/*  Bienvenida */}
        <AnimatedSection delay={0}>
          <InicioHeader
            nombre={data.nombre}
            piso={data.piso}
            dpto={data.dpto}
            periodo={periodoLabel}
            estado={estado}
            estadoPago={estadoPago}
            montoPendiente={montoPendiente}
          />
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <EstadoUnidad
            estado={estado}
            expensaActual={expensaActual}
            montoPagado={montoPagado}
            montoPendiente={montoPendiente}
          />
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <AccionesRapidas />
        </AnimatedSection>
      </div>
    </AppLayout>
  );
}
