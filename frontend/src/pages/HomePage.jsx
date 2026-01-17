import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleLoginClick() {
    if (!user) return navigate("/login");
    if (user.role === "ADMIN") return navigate("/admin");
    if (user.role === "TESORERO") return navigate("/tesorero");
    if (user.role === "PROPIETARIO") return navigate("/propietario");
    return navigate("/dashboard");
  }

  return (
    <div className="bg-[#0f1115] min-h-screen text-white">

      {/* NAVBAR */}
      <nav className="w-full flex justify-between items-center px-10 py-5 border-b border-white/10 bg-[#0f1115]/80 backdrop-blur-md">
  
  {/* LOGO */}
  <h1 
    className="text-3xl font-extrabold text-blue-400 tracking-wide cursor-pointer"
    onClick={() => navigate("/")}
  >
    MiniLoop
  </h1>

  {/* LINKS */}
  <div className="flex items-center gap-6 text-blue-200">
    <button
      onClick={() => navigate("/")}
      className="hover:text-white transition"
    >
      Inicio
    </button>

    <button
      onClick={handleLoginClick}
      className="hover:text-white transition"
    >
      Iniciar sesión
    </button>

    <button
      onClick={() => navigate("/register")}
      className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition text-white shadow-[0_0_10px_rgba(0,150,255,0.5)]"
    >
      Crear cuenta
    </button>
  </div>

</nav>


      {/* HERO SECTION */}
      <div className="flex flex-col items-center text-center mt-10 px-4">

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-blue-300 mb-4"
        >
          Gestioná tu consorcio como un profesional
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg max-w-3xl text-blue-100/80 mb-8"
        >
          Una plataforma moderna y fluida para administrar liquidaciones, unidades,
          pagos, propietarios y toda la información de tu edificio. 
        </motion.p>

        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleLoginClick}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-lg font-semibold 
                     shadow-[0_0_20px_rgba(0,150,255,0.4)] hover:shadow-[0_0_30px_rgba(0,150,255,0.6)]
                     transition-all"
        >
          Comenzar ahora
        </motion.button>

        <motion.img
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
         src="https://images.unsplash.com/photo-1522199670076-2852f80289c3?q=80"


          className="w-full max-w-3xl mt-14 rounded-xl border border-blue-500/30 shadow-xl"
        />
      </div>

      {/* SECTION: FUNCIONES */}
      <section className="mt-24 px-10">
        <h3 className="text-3xl font-bold text-center text-blue-300 mb-10">
          Funcionalidades principales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* CARD 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#1a1f2c] p-6 rounded-2xl border border-blue-500/20 shadow-lg"
          >
            <h4 className="text-xl font-bold text-blue-400 mb-3">Panel del Tesorero</h4>
            <p className="text-blue-100/80">
              Generación de liquidaciones, control de gastos, exportación a PDF
              y estadísticas automáticas.
            </p>
          </motion.div>

          {/* CARD 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#1a1f2c] p-6 rounded-2xl border border-blue-500/20 shadow-lg"
          >
            <h4 className="text-xl font-bold text-blue-400 mb-3">Panel del Propietario</h4>
            <p className="text-blue-100/80">
              Dashboard, expensa actual, pagos realizados, historial completo
              y detalles en un clic.
            </p>
          </motion.div>

          {/* CARD 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#1a1f2c] p-6 rounded-2xl border border-blue-500/20 shadow-lg"
          >
            <h4 className="text-xl font-bold text-blue-400 mb-3">Gestión de Consorcio</h4>
            <p className="text-blue-100/80">
              Información del edificio, unidades, propietarios e integración
              entre módulos en tiempo real.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-24 py-10 text-center text-blue-200/60 border-t border-blue-500/10">
        © {new Date().getFullYear()} MiniLoop — Creado por Víctor Montejo
      </footer>
    </div>
  );
}
