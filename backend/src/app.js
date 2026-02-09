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
import suscripcionRoutes from "./routes/suscripcion.routes.js";
import consorciosRoutes from "./routes/consorcios.routes.js";
import planesRoutes from "./routes/planes.routes.js";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://miniloop-front.onrender.com",
];

// agrega FRONTEND_URL si existe (y le saca / final)
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new Error("CORS bloqueado: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use((req, _res, next) => {
  if (req.headers.origin) console.log("🌐 Origin:", req.headers.origin);
  next();
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));



app.use(express.json());
app.use(morgan("dev"));

// sirve la carpeta uploads como pública
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/upload", uploadRoutes);


// RUTAS DE SUSCRIPCIÓN
app.use("/api/suscripcion", suscripcionRoutes);
// RUTAS DE CONSORCIOS
app.use("/api/consorcios", consorciosRoutes);

// RUTAS DE PLANES
app.use("/api/planes", planesRoutes);




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
