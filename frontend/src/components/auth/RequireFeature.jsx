import { Navigate } from "react-router-dom";
import { useSuscripcion } from "../../hooks/useSuscripcion";
import { useAuth } from "../../context/AuthContext";
import { canUseFeature } from "../../utils/permissions";

export default function RequireFeature({ feature, children }) {
  const { user } = useAuth();
 const { suscripcion, loading } = useSuscripcion();


  if (loading) {
    return null; // después le metemos loader lindo
  }

  const canUse = canUseFeature(
    { role: user.role, suscripcion },
    feature
  );

  if (!canUse) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
