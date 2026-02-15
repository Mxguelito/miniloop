import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSuscripcion } from "../hooks/useSuscripcion";

/* ======================================================
   DATA FIJA DE PLANES (CATÁLOGO)
====================================================== */

const PLANES = [
  {
    id: 1,
    nombre: "BASIC",
    descripcion: "Funciones esenciales para comenzar a gestionar tu consorcio.",
    precio: "Incluido",
    recomendado: false,
    destacado: false,
  },
  {
    id: 2,
    nombre: "PRO",
    descripcion:
      "Todas las funciones activas para administrar tu consorcio sin límites.",
    precio: "$10.000",
    recomendado: true,
    destacado: true,
  },
  {
    id: 3,
    nombre: "PREMIUM",
    descripcion:
      "Automatización avanzada, reportes premium y soporte prioritario.",
    precio: "$15.000",
    recomendado: false,
    destacado: false,
  },
];

/* ======================================================
   PAGE
====================================================== */

export default function PlanesPage() {
  const { user } = useAuth();
  const [activandoPlan, setActivandoPlan] = useState(null);
  const navigate = useNavigate();
  const { suscripcion, refresh } = useSuscripcion();

  const planActual = suscripcion?.plan; // "BASIC" | "PRO" | "PREMIUM"

  async function elegirPlan(planNombre) {
    try {
      setActivandoPlan(planNombre);

      await api.post("/suscripcion/activar", {
        plan: planNombre,
      });

      await refresh(); // refresca la suscripción real

      navigate("/dashboard"); // mejor que "/"
    } catch (error) {
      console.error(error);
      setActivandoPlan(null);
      alert("❌ Error al activar el plan");
    }
  }

  return (
    <AppLayout>
      <div className="p-6 text-white">
        <Hero />

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
          {PLANES.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              planActual={planActual}
              onChoose={() => elegirPlan(plan.nombre)}
              isAdmin={user?.role === "ADMIN"}
            />
          ))}
        </div>

        <FooterNote />
      </div>
      {activandoPlan && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-black border border-violet-500/30 rounded-2xl p-10 text-center shadow-2xl">
            <div className="mb-4 text-violet-400 text-sm uppercase tracking-widest">
              Activando plan
            </div>

            <h2 className="text-3xl font-bold mb-2">{activandoPlan}</h2>

            <p className="text-gray-400">
              Preparando MiniLoop para tu consorcio…
            </p>

            <div className="mt-6 w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      )}
    </AppLayout>
  );
}

/* ======================================================
   HERO
====================================================== */

function Hero() {
  return (
    <div className="text-center max-w-4xl mx-auto mt-12">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Planes de <span className="text-violet-400">MiniLoop</span>
      </h1>

      <p className="mt-6 text-lg text-gray-400">
        Elegí el plan que mejor se adapte a tu consorcio.
        <br />
        Todos comienzan con <b>BASIC</b> y pueden escalar cuando lo necesiten.
      </p>
    </div>
  );
}

/* ======================================================
   PLAN CARD
====================================================== */
function PlanCard({ plan, onChoose, isAdmin, planActual }) {
  const esPlanActual = plan.nombre === planActual;

  const stylesByPlan = {
    BASIC:
      "border-blue-500/30 bg-gradient-to-b from-blue-500/10 to-black hover:from-blue-500/20",
    PRO: "border-violet-500/40 bg-gradient-to-b from-violet-600/25 to-black scale-105 shadow-xl",
    PREMIUM:
      "border-yellow-500/30 bg-gradient-to-b from-yellow-500/15 to-black hover:from-yellow-500/25",
  };

  const buttonByPlan = {
    BASIC: "bg-blue-500/30 hover:bg-blue-500/50",
    PRO: "bg-violet-600 hover:bg-violet-500",
    PREMIUM: "bg-yellow-500/80 hover:bg-yellow-500 text-black",
  };

  return (
    <div
      className={`relative rounded-3xl p-8 border transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl
        ${stylesByPlan[plan.nombre]}`}
    >
      {esPlanActual && (
        <div className="absolute top-4 right-4">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-medium 
      bg-green-500/20 text-green-300 border border-green-500/30"
          >
            Plan actual
          </span>
        </div>
      )}

      {/* BADGE */}
      {plan.recomendado && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full text-xs font-semibold bg-violet-600 text-white shadow">
            ⭐ Recomendado
          </span>
        </div>
      )}

      {/* HEADER */}
      <span className="text-xs uppercase tracking-widest opacity-60">Plan</span>
      <h3 className="text-2xl font-bold mt-1">{plan.nombre}</h3>

      <p className="text-gray-400 mt-3">{plan.descripcion}</p>
      <ul className="mt-4 space-y-2 text-sm text-gray-300">
        {plan.nombre === "BASIC" && (
          <>
            <li>✔ Gestión esencial del consorcio</li>
            <li>✔ Control de expensas y usuarios</li>
            <li>✔ Información clara y centralizada</li>
          </>
        )}

        {plan.nombre === "PRO" && (
          <>
            <li>✔ Todas las funciones activas</li>
            <li>✔ Liquidaciones completas y reportes</li>
            <li>✔ Automatización del día a día</li>
          </>
        )}

        {plan.nombre === "PREMIUM" && (
          <>
            <li>✔ Automatización avanzada</li>
            <li>✔ Reportes premium</li>
            <li>✔ Soporte prioritario</li>
          </>
        )}
      </ul>

      {/* PRICE */}
      <div className="mt-8 text-4xl font-bold">
        {plan.precio}
        <span className="text-sm text-gray-400 font-normal"> / mes</span>
      </div>

      {/* CTA */}
      <button
        onClick={onChoose}
        disabled={esPlanActual}
        className={`mt-8 w-full py-3 rounded-xl font-semibold transition
    ${
      esPlanActual
        ? "bg-green-600/40 cursor-not-allowed text-white"
        : buttonByPlan[plan.nombre]
    }`}
      >
        {esPlanActual ? "Plan activo" : `Activar ${plan.nombre}`}
      </button>

      {/* ADMIN NOTE */}
      {isAdmin && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          Vista administrador
        </div>
      )}
    </div>
  );
}

/* ======================================================
   FOOTER NOTE
====================================================== */

function FooterNote() {
  return (
    <div className="mt-24 text-center text-sm text-gray-500">
      Podés cambiar de plan en cualquier momento.
      <br />
      El plan se activa automáticamente al confirmar la elección.
    </div>
  );
}
