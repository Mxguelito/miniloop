import path from "path";
import { fileURLToPath } from "url";



import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import liquidacionesRoutes from "./routes/liquidaciones.routes.js";
import propietarioRoutes from "./routes/propietario.routes.js";
import tesoreroRoutes from "./routes/tesorero.routes.js";
import kioscoRoutes from "./routes/kiosco.routes.js";
import uploadRoutes from "./routes/upload.routes.js";



const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://miniloop-front.onrender.com",
];


app.use(
  cors({
    origin: (origin, callback) => {
      // permite Postman/Thunder Client (no mandan origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS bloqueado: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// habilita preflight para TODOS
app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));

// sirve la carpeta uploads como pública
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/upload", uploadRoutes);





// RUTAS DE AUTENTICACIÓN
app.use("/api/auth", authRoutes);
// RUTAS DEL ADMIN
app.use("/api/admin", adminRoutes);
app.use("/api/liquidaciones", liquidacionesRoutes);
app.use("/api/propietarios", propietarioRoutes);
app.use("/api/tesorero", tesoreroRoutes);

app.use("/api/kiosco", kioscoRoutes);

// Home
app.get("/", (req, res) => {
  res.json({ message: "Backend Miniloop funcionando ✅" });
});

export default app;
