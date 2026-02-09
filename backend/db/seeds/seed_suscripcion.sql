-- ===============================
-- SEED INICIAL - PLANES + SUSCRIPCIÓN
-- ===============================

BEGIN;

-- -------------------------------
-- PLANES
-- -------------------------------
INSERT INTO planes (nombre, precio, descripcion)
VALUES
  ('BASIC', 50000, 'Plan básico para consorcios pequeños'),
  ('PRO', 120000, 'Plan profesional completo')
ON CONFLICT (nombre) DO NOTHING;

-- -------------------------------
-- SUSCRIPCIÓN ACTIVA (CONSORCIO ÚNICO)
-- -------------------------------
INSERT INTO suscripciones (
  consorcio_id,
  plan_id,
  fecha_inicio,
  fecha_fin,
  estado
)
VALUES (
  1,
  (SELECT id FROM planes WHERE nombre = 'PRO'),
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  'ACTIVA'
);

COMMIT;
