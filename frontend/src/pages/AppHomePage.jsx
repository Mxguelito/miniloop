import AppLayout from "../components/layout/AppLayout";
import HomeHero from "../components/home/HomeHero";
import HomeStats from "../components/home/HomeStats";
import HomeFeed from "../components/home/HomeFeed";
import HomeEstadoConsorcio from "../components/home/HomeEstadoConsorcio";
import HomeDeudoresDetalle from "../components/home/HomeDeudoresDetalle";
import HomeActasReuniones from "../components/home/HomeActasReuniones";
import SuscripcionBanner from "../components/suscripcion/SuscripcionBanner";

import { useAuth } from "../context/AuthContext";
import { useSuscripcion } from "../hooks/useSuscripcion";
import { canUseFeature } from "../utils/permissions";
import { useNavigate } from "react-router-dom";

// después: HomeFeed, HomeKioscoCard, etc.

export default function AppHomePage() {
  const { user } = useAuth();
 const { suscripcion } = useSuscripcion();

  const navigate = useNavigate();

  const canUseHome = canUseFeature(
    { role: user?.role, suscripcion },
    "SOCIAL_HOME",
  );
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <SuscripcionBanner />   {/* 👈 ACÁ */}
        <HomeHero />
        <HomeStats />
        <HomeFeed />
        <HomeActasReuniones />
      </div>

      {!canUseHome && (
        <div
          className="
      fixed inset-0 z-[9999]
      bg-black/70 backdrop-blur-sm
      flex flex-col items-center justify-center
      text-center px-6
    "
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            🔒 Home social deshabilitado
          </h2>

          <p className="text-white/80 mb-6 max-w-lg">
            Este módulo estará disponible en planes activos. Próximamente vas a
            poder interactuar con el consorcio.
          </p>

          <button
            onClick={() => navigate("/planes")}
            className="
          px-6 py-3 rounded-xl
          bg-gradient-to-r from-indigo-500 to-purple-600
          hover:opacity-90 transition
          text-white font-semibold
        "
          >
            Ver planes
          </button>
        </div>
      )}
    </AppLayout>
  );
}
