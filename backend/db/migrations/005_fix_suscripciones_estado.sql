BEGIN;

ALTER TABLE suscripciones
DROP CONSTRAINT IF EXISTS suscripciones_estado_check;

UPDATE suscripciones
SET estado = 'ACTIVO'
WHERE estado IS NULL
   OR estado IN ('ACTIVA', 'ACTIVE', 'activo');

ALTER TABLE suscripciones
ADD CONSTRAINT suscripciones_estado_check
CHECK (
  estado IN ('ACTIVO', 'EN_GRACIA', 'SUSPENDIDO')
);

COMMIT;
