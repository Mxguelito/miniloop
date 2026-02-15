-- ===============================
-- MIGRATION 003 - SUSCRIPCIONES
-- ===============================

BEGIN;

-- -------------------------------
-- TABLA: planes
-- -------------------------------
CREATE TABLE IF NOT EXISTS planes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  precio INTEGER NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- -------------------------------
-- TABLA: suscripciones
-- -------------------------------
CREATE TABLE IF NOT EXISTS suscripciones (
  id SERIAL PRIMARY KEY,
  consorcio_id INTEGER NOT NULL,
  plan_id INTEGER NOT NULL,

  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,

  estado VARCHAR(20) NOT NULL CHECK (
    estado IN ('ACTIVO', 'EN_GRACIA', 'SUSPENDIDO')
  ),

  created_at TIMESTAMP DEFAULT NOW()
);

-- 🔒 Blindaje FK

ALTER TABLE IF EXISTS suscripciones
DROP CONSTRAINT IF EXISTS fk_suscripcion_plan;

ALTER TABLE suscripciones
ADD CONSTRAINT fk_suscripcion_plan
FOREIGN KEY (plan_id)
REFERENCES planes(id);

ALTER TABLE IF EXISTS suscripciones
DROP CONSTRAINT IF EXISTS fk_suscripcion_consorcio;

ALTER TABLE suscripciones
ADD CONSTRAINT fk_suscripcion_consorcio
FOREIGN KEY (consorcio_id)
REFERENCES consorcios(id);

COMMIT;
