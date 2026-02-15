INSERT INTO planes (nombre, precio, descripcion, activo)
VALUES ('PREMIUM', 15000, 'Plan avanzado con automatizaciones premium', true)
ON CONFLICT (nombre)
DO NOTHING;
