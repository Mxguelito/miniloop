-- ============================================
-- MIGRACIÓN 004
-- Fix diseño de fechas en suscripciones
-- Permite fecha_fin NULL para planes activos
-- ============================================

BEGIN;

-- 1️⃣ Asegurar fecha_inicio obligatoria
ALTER TABLE suscripciones
ALTER COLUMN fecha_inicio SET NOT NULL;

-- 2️⃣ Permitir fecha_fin NULL (planes activos)
ALTER TABLE suscripciones
ALTER COLUMN fecha_fin DROP NOT NULL;

COMMIT;
