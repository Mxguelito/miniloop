-- 002_usuarios_soft_delete_y_cascade.sql

-- Asegurar columna estado en usuarios
ALTER TABLE IF EXISTS usuarios
ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'pending';

-- Normalizar usuarios existentes
UPDATE usuarios
SET estado = 'active'
WHERE estado IS NULL;

-- Índice para filtros por estado
CREATE INDEX IF NOT EXISTS idx_usuarios_estado
ON usuarios (estado);

-- Asegurar integridad referencial con borrado en cascada

ALTER TABLE IF EXISTS propietarios
DROP CONSTRAINT IF EXISTS propietarios_usuario_id_fkey;

ALTER TABLE IF EXISTS propietarios
ADD CONSTRAINT propietarios_usuario_id_fkey
FOREIGN KEY (usuario_id)
REFERENCES usuarios(id)
ON DELETE CASCADE;

ALTER TABLE IF EXISTS inquilinos
DROP CONSTRAINT IF EXISTS inquilinos_usuario_id_fkey;

ALTER TABLE IF EXISTS inquilinos
ADD CONSTRAINT inquilinos_usuario_id_fkey
FOREIGN KEY (usuario_id)
REFERENCES usuarios(id)
ON DELETE CASCADE;
