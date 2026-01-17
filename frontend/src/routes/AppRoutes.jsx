import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminUsuariosPage from "../pages/AdminUsuariosPage";
import AdminPage from "../pages/AdminPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import UserPage from "../pages/UserPage";
import ConsorciosPage from "../pages/ConsorciosPage";
import LiquidacionesPage from "../pages/LiquidacionesPage";
import MiConsorcioPage from "../pages/MiConsorcioPage";
import MiUnidadPage from "../pages/MiUnidadPage";
import NuevaLiquidacionPage from "../pages/NuevaLiquidacionPage";
import VerLiquidacionPage from "../pages/VerLiquidacionPage";
import PropietarioDashboard from "../pages/PropietarioDashboard";
import PropietarioLiquidacionesPage from "../pages/PropietarioLiquidacionesPage";
import PropietarioLiquidacionDetallePage from "../pages/PropietarioLiquidacionDetallePage";
import TesoreroDashboard from "../pages/TesoreroDashboard";
import AdminSolicitudesUnidadPage from "../pages/AdminSolicitudesUnidadPage";
import KioscoPage from "../pages/KioscoPage";
import AdminVentasPage from "../pages/AdminVentasPage";
import AdminKioscoProductosPage from "../pages/AdminKioscoProductosPage";







export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
         {/* SIEMPRE ENTRAR AL HOME */}
         <Route path="/" element={<HomePage />} />

         <Route path="/kiosco" element={ <ProtectedRoute>   <KioscoPage />  </ProtectedRoute> }/>



         {/* LOGIN  */}
         <Route path="/login" element={<LoginPage />} />

         {/* REGISTER  */}
          <Route path="/register" element={<RegisterPage />} />

          <Route
           path="/dashboard"
          element={
          <ProtectedRoute>
           <DashboardPage />
           </ProtectedRoute>
             }
            />
               <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminPage /></ProtectedRoute>}/>

               <Route path="/admin/usuarios"element={<ProtectedRoute roles={["ADMIN"]}><AdminUsuariosPage /></ProtectedRoute>}/>
                <Route path="/admin/ventas"element={<ProtectedRoute roles={["ADMIN"]}><AdminVentasPage /></ProtectedRoute>}/>
                <Route path="/admin/kiosco-productos"element={<ProtectedRoute roles={["ADMIN"]}><AdminKioscoProductosPage /></ProtectedRoute>}/>
               <Route path="/admin/solicitudes-unidad" element={<ProtectedRoute roles={["ADMIN"]}> <AdminSolicitudesUnidadPage /></ProtectedRoute>}/>


               <Route path="/tesorero"element={<ProtectedRoute roles={["TESORERO"]}><TesoreroDashboard /></ProtectedRoute>}/>


               <Route path="/consorcios"element={<ProtectedRoute><ConsorciosPage /></ProtectedRoute>}/>

        <Route
          path="/liquidaciones"
          element={
            <ProtectedRoute>
              <LiquidacionesPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/liquidaciones/nueva"
          element={
            <ProtectedRoute>
              <NuevaLiquidacionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/liquidaciones/:id"
          element={
            <ProtectedRoute>
              <VerLiquidacionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mi-consorcio"
          element={
            <ProtectedRoute>
              <MiConsorcioPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mi-unidad"
          element={
            <ProtectedRoute>
              <MiUnidadPage />
            </ProtectedRoute>
          }
        />

        {/* ===============================
    RUTAS DEL PROPIETARIO
================================= */}
<Route
  path="/propietario"
  element={
    <ProtectedRoute roles={["PROPIETARIO"]}>
      <PropietarioDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/propietario/liquidaciones"
  element={
    <ProtectedRoute roles={["PROPIETARIO"]}>
      <PropietarioLiquidacionesPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/propietario/liquidacion/:id"
  element={
    <ProtectedRoute roles={["PROPIETARIO"]}>
      <PropietarioLiquidacionDetallePage />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}
