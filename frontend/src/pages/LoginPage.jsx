import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);

      if (!res.ok) {
        setError(res.message);
        setLoading(false);
        return;
      }

      if (res.user.role === "ADMIN") navigate("/admin");
      else if (res.user.role === "TESORERO") navigate("/tesorero");
      else if (res.user.role === "PROPIETARIO") navigate("/propietario");
      else if (res.user.role === "INQUILINO") navigate("/inquilino");
      else navigate("/");
    } catch (err) {
      setError("Error de conexión. Intentá nuevamente.");
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
            mb-6
            md:absolute md:-top-14 md:left-0
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

        {/* CARD LOGIN */}
        <form
          onSubmit={handleSubmit}
          className="
            bg-[#151820]/90 backdrop-blur-xl
            p-8 rounded-3xl
            border border-blue-500/30
            shadow-[0_0_40px_rgba(0,150,255,0.25)]
          "
        >
          <h2 className="text-3xl mb-6 font-extrabold text-blue-300 text-center">
            Miniloop Login
          </h2>

          {error && (
            <div className="bg-red-600/20 border border-red-500 text-red-300 p-2 rounded-lg mb-4 text-center text-sm">
              {error}
            </div>
          )}

          <label className="text-sm text-slate-300">Email</label>
          <input
            type="email"
            className="
              w-full p-3 mb-4 rounded-xl
              bg-[#0f172a] border border-white/10
              focus:outline-none focus:border-blue-400/60
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="text-sm text-slate-300">Contraseña</label>
          <input
            type="password"
            className="
              w-full p-3 mb-2 rounded-xl
              bg-[#0f172a] border border-white/10
              focus:outline-none focus:border-blue-400/60
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() =>
              alert("Próximamente podrás recuperar tu contraseña 🔐")
            }
            className="w-full text-right text-xs text-blue-400 hover:underline mb-4"
          >
            ¿Olvidaste tu contraseña?
          </button>

          <button
  type="submit"
  disabled={loading}
  className={`
    w-full py-3 rounded-xl
    text-white font-semibold
    transition-all
    shadow-[0_0_20px_rgba(59,130,246,0.4)]
    ${
      loading
        ? "bg-blue-400 cursor-not-allowed opacity-70"
        : "bg-blue-600 hover:bg-blue-500"
    }
  `}
>
  {loading ? "Ingresando..." : "Entrar"}
</button>


          <p className="mt-4 text-sm text-center text-slate-300">
            ¿No tenés cuenta?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Crear cuenta
            </Link>
          </p>
        </form>
      </div>
      {loading && (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-blue-300 text-sm">
        Verificando credenciales…
      </p>
    </div>
  </div>
)}

    </div>
  );
}
