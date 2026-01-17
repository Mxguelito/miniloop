import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  // Cargar sesión desde localStorage
  
  useEffect(() => {
    const saved = localStorage.getItem("miniloop_user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  // LOGIN REAL (Backend)
  
  async function login(email, password) {
    try {
      const res = await loginUser({ email, password });

      // guardamos token
      localStorage.setItem("token", res.token);

      // guardamos usuario
      localStorage.setItem("miniloop_user", JSON.stringify(res.user));
      setUser(res.user);

      return { ok: true, user: res.user };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Error al iniciar sesión",
      };
    }
  }

  
  // REGISTRO 
 
  async function register(data) {
    return await registerUser(data);
  }

  
  // LOGOUT
  
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("miniloop_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
