-- ===============================
-- MIGRATION 003 - SUSCRIPCIONES
-- ===============================

BEGIN;

-- -------------------------------
-- TABLA: planes
-- -------------------------------
CREATE TABLE IF NOT EXISTS planes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,      -- BASIC, PRO, PREMIUM
  precio INTEGER NOT NULL,                  -- precio mensual
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
    estado IN ('ACTIVA', 'EN_GRACIA', 'SUSPENDIDA')
  ),

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_suscripcion_plan
    FOREIGN KEY (plan_id)
    REFERENCES planes(id),

  CONSTRAINT fk_suscripcion_consorcio
    FOREIGN KEY (consorcio_id)
    REFERENCES consorcios(id)
);

COMMIT;
