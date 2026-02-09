export function canUseFeature({ role, suscripcion }, feature) {
  // 👑 ADMIN: nunca se bloquea
  if (role === "ADMIN") return true;

  // 🧾 Datos mínimos
  const estado = suscripcion?.estado;
  const plan = suscripcion?.plan;

  // 🔍 VER INFO siempre permitido
  if (feature === "VIEW_INFO") return true;

  // 🚫 Sin suscripción activa
  if (estado !== "ACTIVO" && estado !== "EN_GRACIA") {
    // Tesorero puede ver info, nada más
    return false;
  }

  // 🔓 Con suscripción activa
  switch (feature) {
    case "KIOSCO":
      return role === "PROPIETARIO" && plan !== "BASIC";

    case "PAGOS":
      return role === "PROPIETARIO";

    case "EXPORTAR_PDF":
      return role === "TESORERO" && plan !== "BASIC";

    default:
      return false;
  }
}
