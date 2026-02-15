BEGIN;

ALTER TABLE suscripciones
DROP CONSTRAINT IF EXISTS suscripciones_estado_check;

-- Normalizar estados conocidos
UPDATE suscripciones
SET estado = 'ACTIVO'
WHERE estado IS NULL
   OR estado IN ('ACTIVA', 'ACTIVE', 'activo');

-- Blindaje extra
UPDATE suscripciones
SET estado = 'SUSPENDIDO'
WHERE estado NOT IN ('ACTIVO', 'EN_GRACIA', 'SUSPENDIDO');

ALTER TABLE suscripciones
ADD CONSTRAINT suscripciones_estado_check
CHECK (
  estado IN ('ACTIVO', 'EN_GRACIA', 'SUSPENDIDO')
);

COMMIT;
