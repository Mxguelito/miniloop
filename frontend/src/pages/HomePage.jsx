import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <div className="bg-gradient-to-b from-[#0b1220] to-[#0f172a] text-slate-100">

      {/* NAVBAR */}
      <nav className="w-full flex justify-between items-center
                      px-6 md:px-12 py-4
                      border-b border-white/10
                      bg-[#0b1220]/80 backdrop-blur-md">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold
                     bg-gradient-to-r from-blue-400 to-cyan-300
                     bg-clip-text text-transparent
                     cursor-pointer">
          MiniLoop
        </h1>

        <div className="flex items-center gap-6 text-sm">
          <NavItem to="/" active>
  Inicio
</NavItem>

<NavItem to="/login">
  Iniciar sesión
</NavItem>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 rounded-lg bg-blue-600
                       hover:bg-blue-500 transition
                       shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            Crear cuenta
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 md:px-12 pt-24 pb-28 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6
                       bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400
                       bg-clip-text text-transparent
                       drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]">
          Gestioná tu consorcio como un profesional
        </h2>

        <p className="max-w-3xl mx-auto text-slate-300 text-base md:text-lg mb-10">
          Una plataforma moderna y clara para administrar liquidaciones,
          propietarios, pagos y toda la información del edificio.
        </p>

        <button
          onClick={handleLoginClick}
          className="px-10 py-4 rounded-xl bg-blue-600
                     hover:bg-blue-500 text-lg font-semibold
                     shadow-[0_0_35px_rgba(59,130,246,0.7)]
                     transition-all">
          Comenzar ahora
        </button>
      </section>

      
   {/* ================= FUNCIONALIDADES ================= */}
<section className="relative mt-28 px-4 md:px-10">
  {/* TÍTULO */}
  <h3 className="
    text-center text-4xl md:text-5xl font-extrabold mb-16
    bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400
    bg-clip-text text-transparent
    tracking-tight
  ">
    Funcionalidades principales
  </h3>

  {/* GRID */}
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
    
    {[
      {
        title: "Panel del Tesorero",
        text: "Liquidaciones automáticas, control de gastos, exportación a PDF y estadísticas claras en tiempo real."
      },
      {
        title: "Panel del Propietario",
        text: "Dashboard claro, expensa actual, pagos realizados e historial completo desde cualquier dispositivo."
      },
      {
        title: "Gestión del Consorcio",
        text: "Información centralizada del edificio, unidades, propietarios y administración general."
      }
    ].map((card, i) => (
      <div
        key={i}
        className="
          group relative rounded-3xl p-[1px]
          bg-gradient-to-br from-blue-500/40 via-cyan-400/20 to-transparent
          transition-transform duration-300 hover:-translate-y-2
        "
      >
        <div className="
          relative h-full rounded-3xl
          bg-[#0b1220]/90 backdrop-blur-xl
          p-8
          border border-white/10
          transition-all duration-300
          group-hover:border-blue-400/40
          group-hover:shadow-[0_25px_60px_rgba(59,130,246,0.35)]
        ">
          <h4 className="text-2xl font-semibold text-blue-400 mb-4">
            {card.title}
          </h4>

          <p className="text-slate-300 leading-relaxed text-sm">
            {card.text}
          </p>

          {/* Glow interno */}
          <div className="
            pointer-events-none absolute inset-0 rounded-3xl
            opacity-0 group-hover:opacity-100
            transition duration-300
            bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_65%)]
          " />
        </div>
      </div>
    ))}
  </div>
</section>

{/* ================= TESTIMONIOS ================= */}
<section className="mt-32 px-6 md:px-12 pb-32">
  <div className="
    max-w-7xl mx-auto
    rounded-[36px]
    bg-gradient-to-br from-[#0b1220]/80 to-[#0f172a]/80
    backdrop-blur-2xl
    border border-white/10
    shadow-[0_0_120px_rgba(0,0,0,0.7)]
    p-10 md:p-16
  ">
    {/* TÍTULO */}
    <h3 className="
      text-center text-4xl md:text-5xl font-extrabold mb-20
      bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300
      bg-clip-text text-transparent
    ">
      Lo que dicen quienes ya usan MiniLoop
    </h3>

    {/* GRID TESTIMONIOS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {[
        {
          text: "Antes llevaba todo en Excel. Con MiniLoop tengo las liquidaciones claras y ordenadas.",
          name: "Carlos",
          role: "Administrador"
        },
        {
          text: "Ahora puedo ver mi expensa y el historial desde el celular, sin complicaciones.",
          name: "Laura",
          role: "Propietaria"
        },
        {
          text: "La gestión del consorcio dejó de ser un problema. Es rápida, clara y confiable.",
          name: "Martín",
          role: "Tesorero"
        }
      ].map((t, i) => (
        <div
          key={i}
          className="
            group relative rounded-3xl p-[1px]
            bg-gradient-to-br from-blue-500/30 to-cyan-400/10
            hover:-translate-y-2 transition-transform duration-300
          "
        >
          <div className="
            h-full rounded-3xl
            bg-[#0b1220]/90 backdrop-blur-xl
            p-8
            border border-white/10
            group-hover:border-blue-400/40
            group-hover:shadow-[0_25px_60px_rgba(59,130,246,0.35)]
            transition-all duration-300
          ">
            {/* Avatar futurístico */}
            <div className="
              w-14 h-14 mb-6 rounded-full
              bg-gradient-to-br from-blue-400 to-cyan-300
              flex items-center justify-center
              text-[#0b1220] font-bold text-lg
              shadow-[0_0_25px_rgba(59,130,246,0.6)]
            ">
              {t.name.charAt(0)}
            </div>

            <p className="text-slate-300 italic leading-relaxed mb-6">
              “{t.text}”
            </p>

            <div className="text-blue-400 font-semibold">
              {t.name}
            </div>
            <div className="text-slate-400 text-sm">
              {t.role} · Usuario verificado
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* FOOTER */}
     <footer className="mt-28 border-t border-white/10 bg-gradient-to-b from-[#0b1220] to-[#0f172a]">
  <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">

    {/* IZQUIERDA — MARCA */}
    <div className="text-center md:text-left">
      <h3 className="text-xl font-bold text-blue-400 tracking-tight">
        MiniLoop
      </h3>
      <p className="text-sm text-slate-400 mt-1">
        Gestión moderna de consorcios
      </p>
    </div>

    {/* CENTRO — PROPÓSITO / VALORES */}
    <div className="text-center">
     

      <div className="flex justify-center gap-6 text-xs text-slate-400">
        <span className="hover:text-white transition cursor-default">
          Transparencia
        </span>
        <span className="hover:text-white transition cursor-default">
          Seguridad
        </span>
        <span className="hover:text-white transition cursor-default">
          Soporte humano
        </span>
      </div>
    </div>

    {/* DERECHA — REDES SOCIALES */}
    <div className="flex justify-center md:justify-end gap-5">
      {/* Instagram */}
      <SocialIcon color="#E1306C" label="Instagram">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm6.5-.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
        </svg>
      </SocialIcon>

      {/* Facebook */}
      <SocialIcon color="#1877F2" label="Facebook">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
        </svg>
      </SocialIcon>

      {/* X / Twitter */}
      <SocialIcon color="#ffffff" label="X">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M18.3 2H21l-6.5 7.4L22 22h-6.4l-5-6-5.3 6H2l7-8L2 2h6.5l4.6 5.3L18.3 2z"/>
        </svg>
      </SocialIcon>
    </div>
  </div>

  {/* FOOTER BOTTOM */}
  <div className="text-center text-xs text-slate-500 pb-6">
    © {new Date().getFullYear()} MiniLoop — Creado por Víctor Montejo
  </div>
</footer>

    </div>
  );
}

/* ÍCONO SOCIAL */
function SocialIcon({ children, color, label }) {
  return (
    <div
      title={label}
      className="w-11 h-11 flex items-center justify-center
                 rounded-full bg-white/10
                 border border-white/10
                 shadow-[0_0_20px_rgba(59,130,246,0.25)]
                 hover:scale-110
                 hover:shadow-[0_0_35px_rgba(59,130,246,0.45)]
                 transition"
      style={{ color }}
    >
      {children}
    </div>
  );
}
function NavItem({ children, to, active = false }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={`
        relative px-2 py-1 text-sm transition
        ${active ? "text-blue-400" : "text-blue-200/80 hover:text-white"}
        after:absolute after:left-0 after:-bottom-1
        after:h-[2px] after:w-full after:origin-left
        after:scale-x-0 after:bg-blue-400
        after:transition-transform after:duration-300
        hover:after:scale-x-100
        ${active ? "after:scale-x-100" : ""}
      `}
    >
      {children}
    </button>
  );
}

