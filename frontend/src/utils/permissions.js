const PLAN_PERMISSIONS = {
  BASIC: [
    "VIEW_INFO",
  ],

  PRO: [
    "VIEW_INFO",
    "KIOSCO",
    "MI_UNIDAD",
    "MIS_LIQUIDACIONES",
    "TESORERO_PANEL",
    "LIQUIDACIONES",
    "SOCIAL_HOME",
  ],

  PREMIUM: [
    "VIEW_INFO",
    "KIOSCO",
    "MI_UNIDAD",
    "MIS_LIQUIDACIONES",
    "TESORERO_PANEL",
    "LIQUIDACIONES",
    "EXPORTAR_PDF",
    "SOCIAL_HOME",
  ],
};

export function canUseFeature({ role, suscripcion }, feature) {
  if (role === "ADMIN") return true;

  const estado = suscripcion?.estado;
  const plan = suscripcion?.plan;

  if (!plan) return false;

  // Si no está activa la suscripción → todo bloqueado
  if (estado !== "ACTIVO" && estado !== "EN_GRACIA") {
    return false;
  }

  const allowedFeatures = PLAN_PERMISSIONS[plan] || [];

  return allowedFeatures.includes(feature);
}
