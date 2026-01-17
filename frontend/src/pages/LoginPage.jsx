import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await login(email, password);

    if (!res.ok) {
      setError(res.message);
      return;
    }

    // Redirección inteligente según rol
    if (res.user.role === "ADMIN") navigate("/admin");
    else if (res.user.role === "TESORERO") navigate("/tesorero");
    else if (res.user.role === "PROPIETARIO") navigate("/propietario");
    else if (res.user.role === "INQUILINO") navigate("/inquilino");
    else navigate("/");
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f1115] text-white relative">
      <button
  type="button"
  onClick={() => navigate("/")}
  className="absolute top-10 left-10 px-4 py-2 rounded-lg bg-white/10 border border-white/20 
             hover:bg-white/20 transition text-blue-300 backdrop-blur-md"
>
  ← Volver al Home
</button>


      <form
        onSubmit={handleSubmit}
        className="bg-[#151820] p-8 rounded-2xl w-96 border border-blue-500/30 shadow-[0_0_25px_rgba(0,150,255,0.15)]"
      >
        <h2 className="text-3xl mb-6 font-bold text-blue-300 text-center">
          Miniloop Login
        </h2>

        {error && (
          <div className="bg-red-600/30 border border-red-500 text-red-300 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <label>Email</label>
        <input
          type="email"
          className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

       <label>Contraseña</label>
<input
  type="password"
  className="w-full p-2 mb-2 rounded bg-gray-800 border border-gray-700"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

{/* LINK OLVIDASTE TU CONTRASEÑA */}
<button
  type="button"
  onClick={() =>
    alert("Próximamente podrás recuperar tu contraseña desde aquí 🔐")
  }
  className="w-full text-right text-xs text-blue-400 hover:underline mb-4"
>
  ¿Olvidaste tu contraseña?
</button>

<button
  type="submit"
  className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-500 
             text-white font-semibold transition-all"
>
  Entrar
</button>


        <p className="mt-3 text-sm text-center text-gray-300">
          ¿No tenés cuenta?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Crear cuenta
          </a>
        </p>
      </form>
    </div>
  );
}
