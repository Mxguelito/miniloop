import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    role: "PROPIETARIO"   // por defecto propietario
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

    try {
      const res = await register(form);
      setMsg(res.message);
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse.");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f1115] text-white">
      <button
  type="button"
  onClick={() => navigate("/")}
  className="absolute top-10 left-10 px-4 py-2 rounded-lg bg-white/10 border border-white/20 
             hover:bg-white/20 transition text-green-300 backdrop-blur-md"
>
  ← Volver al Home
</button>

      <form
        onSubmit={handleSubmit}
        className="bg-[#151820] p-8 rounded-2xl w-96 border border-green-500/30 shadow-[0_0_25px_rgba(0,255,150,0.15)]"
      >
        <h2 className="text-3xl mb-6 font-bold text-green-300 text-center">
          Crear Cuenta
        </h2>

        {msg && (
          <div className="bg-green-600/20 border border-green-500 text-green-300 p-2 rounded mb-4 text-center">
            {msg}
          </div>
        )}

        {error && (
          <div className="bg-red-600/20 border border-red-500 text-red-300 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <label>Nombre</label>
        <input
          name="nombre"
          className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          name="email"
          className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
          onChange={handleChange}
        />

        <label>Contraseña</label>
        <input
          name="password"
          type="password"
          className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
          onChange={handleChange}
        />

        <label>Rol</label>
        <select
          name="role"
          className="w-full p-2 mb-6 rounded bg-gray-800 border border-gray-700"
          value={form.role}
          onChange={handleChange}
        >
          <option value="PROPIETARIO">Propietario</option>
          <option value="INQUILINO">Inquilino</option>
          <option value="TESORERO">Tesorero</option>
          
        </select>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-500 text-white font-semibold"
        >
          Registrarme
        </button>

        <p className="mt-3 text-sm text-center text-gray-300">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
  Iniciar sesión
</Link>

        </p>
      </form>
    </div>
  );
}
