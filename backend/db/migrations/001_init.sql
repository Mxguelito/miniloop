




-- =========================
-- 001_init.sql
-- Migración base MiniLoop
-- =========================

CREATE TABLE public.consorcios (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    creado_en TIMESTAMP DEFAULT now()
);

CREATE SEQUENCE public.consorcios_id_seq START 1;
ALTER TABLE public.consorcios ALTER COLUMN id SET DEFAULT nextval('public.consorcios_id_seq');


CREATE TABLE public.usuarios (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(20) DEFAULT 'PROPIETARIO' NOT NULL,
    estado VARCHAR(20) DEFAULT 'pending' NOT NULL,
    creado_en TIMESTAMP DEFAULT now()
);

CREATE SEQUENCE public.usuarios_id_seq START 1;
ALTER TABLE public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq');


CREATE TABLE public.propietarios (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(150) NOT NULL UNIQUE,
    unidad VARCHAR(20),
    piso TEXT,
    dpto TEXT,
    dni VARCHAR(30),
    telefono VARCHAR(30),
    usuario_id INTEGER,
    consorcio_id INTEGER,
    creado_en TIMESTAMP DEFAULT now()
);

CREATE SEQUENCE public.propietarios_id_seq START 1;
ALTER TABLE public.propietarios ALTER COLUMN id SET DEFAULT nextval('public.propietarios_id_seq');


CREATE TABLE public.inquilinos (
    id INTEGER PRIMARY KEY,
    usuario_id INTEGER,
    nombre VARCHAR(100),
    email VARCHAR(120),
    unidad VARCHAR(10),
    piso VARCHAR(10),
    dpto VARCHAR(10),
    created_at TIMESTAMP DEFAULT now()
);

CREATE SEQUENCE public.inquilinos_id_seq START 1;
ALTER TABLE public.inquilinos ALTER COLUMN id SET DEFAULT nextval('public.inquilinos_id_seq');


CREATE TABLE public.liquidaciones (
    id INTEGER PRIMARY KEY,
    mes INTEGER NOT NULL,
    anio INTEGER NOT NULL,
    total_gastos NUMERIC(12,2) DEFAULT 0 NOT NULL,
    total_ingresos NUMERIC(12,2) DEFAULT 0 NOT NULL,
    saldo_final NUMERIC(12,2) DEFAULT 0 NOT NULL,
    monto_expensa NUMERIC(12,2) DEFAULT 0 NOT NULL,
    estado TEXT DEFAULT 'Borrador',
    propietarios JSONB DEFAULT '[]',
    movimientos JSONB DEFAULT '[]',
    consorcio_id INTEGER,
    creado_en TIMESTAMP DEFAULT now()
);

CREATE SEQUENCE public.liquidaciones_id_seq START 1;
ALTER TABLE public.liquidaciones ALTER COLUMN id SET DEFAULT nextval('public.liquidaciones_id_seq');


CREATE TABLE public.movimientos (
    id INTEGER PRIMARY KEY,
    liquidacion_id INTEGER NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    motivo VARCHAR(200),
    monto NUMERIC(12,2) NOT NULL
);

CREATE SEQUENCE public.movimientos_id_seq START 1;
ALTER TABLE public.movimientos ALTER COLUMN id SET DEFAULT nextval('public.movimientos_id_seq');


CREATE TABLE public.saldos (
    id INTEGER PRIMARY KEY,
    propietario_id INTEGER NOT NULL,
    liquidacion_id INTEGER NOT NULL,
    monto_expensa NUMERIC(12,2) NOT NULL,
    monto_pagado NUMERIC(12,2) DEFAULT 0,
    saldo NUMERIC(12,2) DEFAULT 0 NOT NULL,
    piso TEXT,
    dpto TEXT,
    creado_en TIMESTAMP DEFAULT now()
);

CREATE SEQUENCE public.saldos_id_seq START 1;
ALTER TABLE public.saldos ALTER COLUMN id SET DEFAULT nextval('public.saldos_id_seq');


CREATE TABLE public.solicitudes_unidad (
    id INTEGER PRIMARY KEY,
    propietario_id INTEGER NOT NULL,
    piso VARCHAR(20),
    dpto VARCHAR(20),
    unidad VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'pending' NOT NULL,
    creado_en TIMESTAMP DEFAULT now()
);

CREATE SEQUENCE public.solicitudes_unidad_id_seq START 1;
ALTER TABLE public.solicitudes_unidad ALTER COLUMN id SET DEFAULT nextval('public.solicitudes_unidad_id_seq');


CREATE TABLE public.kiosco_products (
    id INTEGER PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    category VARCHAR(30) NOT NULL,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE SEQUENCE public.kiosco_products_id_seq START 1;
ALTER TABLE public.kiosco_products ALTER COLUMN id SET DEFAULT nextval('public.kiosco_products_id_seq');


CREATE TABLE public.kiosco_orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    total INTEGER DEFAULT 0 CHECK (total >= 0),
    notes TEXT,
    created_at TIMESTAMP DEFAULT now()
);

CREATE SEQUENCE public.kiosco_orders_id_seq START 1;
ALTER TABLE public.kiosco_orders ALTER COLUMN id SET DEFAULT nextval('public.kiosco_orders_id_seq');


CREATE TABLE public.kiosco_order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    price INTEGER NOT NULL CHECK (price >= 0),
    subtotal INTEGER NOT NULL CHECK (subtotal >= 0)
);

CREATE SEQUENCE public.kiosco_order_items_id_seq START 1;
ALTER TABLE public.kiosco_order_items ALTER COLUMN id SET DEFAULT nextval('public.kiosco_order_items_id_seq');


-- FOREIGN KEYS

ALTER TABLE public.propietarios
    ADD CONSTRAINT fk_propietarios_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);

ALTER TABLE public.propietarios
    ADD CONSTRAINT fk_propietarios_consorcio FOREIGN KEY (consorcio_id) REFERENCES public.consorcios(id);

ALTER TABLE public.inquilinos
    ADD CONSTRAINT fk_inquilinos_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);

ALTER TABLE public.liquidaciones
    ADD CONSTRAINT fk_liquidaciones_consorcio FOREIGN KEY (consorcio_id) REFERENCES public.consorcios(id) ON DELETE SET NULL;

ALTER TABLE public.movimientos
    ADD CONSTRAINT fk_movimientos_liquidacion FOREIGN KEY (liquidacion_id) REFERENCES public.liquidaciones(id) ON DELETE CASCADE;

ALTER TABLE public.saldos
    ADD CONSTRAINT fk_saldos_propietario FOREIGN KEY (propietario_id) REFERENCES public.propietarios(id) ON DELETE CASCADE;

ALTER TABLE public.saldos
    ADD CONSTRAINT fk_saldos_liquidacion FOREIGN KEY (liquidacion_id) REFERENCES public.liquidaciones(id) ON DELETE CASCADE;

ALTER TABLE public.solicitudes_unidad
    ADD CONSTRAINT fk_solicitudes_propietario FOREIGN KEY (propietario_id) REFERENCES public.propietarios(id) ON DELETE CASCADE;

ALTER TABLE public.kiosco_order_items
    ADD CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES public.kiosco_orders(id) ON DELETE CASCADE;

ALTER TABLE public.kiosco_order_items
    ADD CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES public.kiosco_products(id);
