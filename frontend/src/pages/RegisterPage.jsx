import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    role: "PROPIETARIO",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      const res = await register(form);
      setMsg(res.message);
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-white px-4">
      {/* WRAPPER */}
      <div className="relative w-full max-w-md">
        {/* VOLVER AL HOME */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="
    mt-4 mb-8
    md:absolute md:-top-20 md:left-0

    flex items-center gap-2
    px-4 py-2 rounded-xl
    bg-white/10 border border-white/10
    text-sm text-blue-300
    hover:bg-white/20 transition
    backdrop-blur-md
  "
        >
          ← Volver al Home
        </button>

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              {/* Spinner */}
              <div className="w-12 h-12 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />

              {/* Texto */}
              <p className="text-sm text-violet-300 tracking-wide">
                Creando cuenta…
              </p>
            </div>
          </div>
        )}

        {/* CARD REGISTER */}
        <form
          onSubmit={handleSubmit}
          className="
            bg-[#151820]/90 backdrop-blur-xl
            p-8 rounded-3xl
            border border-violet-500/30
            shadow-[0_0_40px_rgba(139,92,246,0.25)]
          "
        >
          <h2
            className="
              text-3xl mb-6 font-extrabold text-center
              bg-gradient-to-r from-blue-400 to-violet-400
              bg-clip-text text-transparent
            "
          >
            Crear cuenta
          </h2>

          {msg && (
            <div className="bg-blue-600/20 border border-blue-500 text-blue-300 p-2 rounded-lg mb-4 text-center text-sm">
              {msg}
            </div>
          )}

          {error && (
            <div className="bg-red-600/20 border border-red-500 text-red-300 p-2 rounded-lg mb-4 text-center text-sm">
              {error}
            </div>
          )}

          <label className="text-sm text-slate-300">Nombre</label>
          <input
            name="nombre"
            className="
              w-full p-3 mb-3 rounded-xl
              bg-[#0f172a] border border-white/10
              focus:outline-none focus:border-violet-400/60
            "
            onChange={handleChange}
          />

          <label className="text-sm text-slate-300">Email</label>
          <input
            name="email"
            type="email"
            className="
              w-full p-3 mb-3 rounded-xl
              bg-[#0f172a] border border-white/10
              focus:outline-none focus:border-violet-400/60
            "
            onChange={handleChange}
          />

          <label className="text-sm text-slate-300">Contraseña</label>
          <input
            name="password"
            type="password"
            className="
              w-full p-3 mb-3 rounded-xl
              bg-[#0f172a] border border-white/10
              focus:outline-none focus:border-violet-400/60
            "
            onChange={handleChange}
          />

          <label className="text-sm text-slate-300">Rol</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="
              w-full p-3 mb-6 rounded-xl
              bg-[#0f172a] border border-white/10
              focus:outline-none focus:border-violet-400/60
            "
          >
            <option value="PROPIETARIO">Propietario</option>
            <option value="INQUILINO">Inquilino</option>
            <option value="TESORERO">Tesorero</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className={`
    w-full py-3 rounded-xl
    bg-gradient-to-r from-blue-600 to-violet-600
    hover:from-blue-500 hover:to-violet-500
    text-white font-semibold
    transition-all
    shadow-[0_0_25px_rgba(139,92,246,0.45)]
    ${loading ? "opacity-60 cursor-not-allowed" : ""}
  `}
          >
            {loading ? "Procesando…" : "Registrarme"}
          </button>

          <p className="mt-4 text-sm text-center text-slate-300">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
