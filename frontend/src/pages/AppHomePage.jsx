import AppLayout from "../components/layout/AppLayout";
import HomeHero from "../components/home/HomeHero";
import HomeStats from "../components/home/HomeStats";
import HomeFeed from "../components/home/HomeFeed";
import HomeEstadoConsorcio from "../components/home/HomeEstadoConsorcio";
import HomeDeudoresDetalle from "../components/home/HomeDeudoresDetalle";
import HomeActasReuniones from "../components/home/HomeActasReuniones";
import SuscripcionBanner from "../components/suscripcion/SuscripcionBanner";
// después: HomeFeed, HomeKioscoCard, etc.

export default function AppHomePage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <SuscripcionBanner />
        <HomeHero />
        <HomeStats />
        <HomeDeudoresDetalle />{/* SOLO admin/tesorero */}
        <HomeFeed />
        <HomeActasReuniones />
      </div>
    </AppLayout>
  );
}
