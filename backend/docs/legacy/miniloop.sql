--
-- PostgreSQL database dump
--

\restrict DrVSbqsgvBHGxnapqjcb6SoOf1sI4sDWmwwabYfwtWmNDX2P6H7VeRIpUzGKkGz

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

-- Started on 2026-01-20 12:47:25

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16452)
-- Name: consorcios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consorcios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    direccion character varying(200),
    creado_en timestamp without time zone DEFAULT now()
);


ALTER TABLE public.consorcios OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16451)
-- Name: consorcios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consorcios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consorcios_id_seq OWNER TO postgres;

--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 223
-- Name: consorcios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consorcios_id_seq OWNED BY public.consorcios.id;


--
-- TOC entry 230 (class 1259 OID 16521)
-- Name: inquilinos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inquilinos (
    id integer NOT NULL,
    usuario_id integer,
    nombre character varying(100),
    email character varying(120),
    unidad character varying(10),
    piso character varying(10),
    dpto character varying(10),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.inquilinos OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16520)
-- Name: inquilinos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inquilinos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inquilinos_id_seq OWNER TO postgres;

--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 229
-- Name: inquilinos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inquilinos_id_seq OWNED BY public.inquilinos.id;


--
-- TOC entry 238 (class 1259 OID 16617)
-- Name: kiosco_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kiosco_order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    qty integer NOT NULL,
    price integer NOT NULL,
    subtotal integer NOT NULL,
    CONSTRAINT kiosco_order_items_price_check CHECK ((price >= 0)),
    CONSTRAINT kiosco_order_items_qty_check CHECK ((qty > 0)),
    CONSTRAINT kiosco_order_items_subtotal_check CHECK ((subtotal >= 0))
);


ALTER TABLE public.kiosco_order_items OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16616)
-- Name: kiosco_order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kiosco_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kiosco_order_items_id_seq OWNER TO postgres;

--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 237
-- Name: kiosco_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kiosco_order_items_id_seq OWNED BY public.kiosco_order_items.id;


--
-- TOC entry 236 (class 1259 OID 16603)
-- Name: kiosco_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kiosco_orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    total integer DEFAULT 0 NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT kiosco_orders_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'PAID'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT kiosco_orders_total_check CHECK ((total >= 0))
);


ALTER TABLE public.kiosco_orders OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16602)
-- Name: kiosco_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kiosco_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kiosco_orders_id_seq OWNER TO postgres;

--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 235
-- Name: kiosco_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kiosco_orders_id_seq OWNED BY public.kiosco_orders.id;


--
-- TOC entry 234 (class 1259 OID 16587)
-- Name: kiosco_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kiosco_products (
    id integer NOT NULL,
    name character varying(120) NOT NULL,
    description text,
    price integer NOT NULL,
    category character varying(30) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    image_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT kiosco_products_category_check CHECK (((category)::text = ANY ((ARRAY['snacks'::character varying, 'bebidas'::character varying, 'limpieza'::character varying])::text[]))),
    CONSTRAINT kiosco_products_price_check CHECK ((price >= 0)),
    CONSTRAINT kiosco_products_stock_check CHECK ((stock >= 0))
);


ALTER TABLE public.kiosco_products OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16586)
-- Name: kiosco_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kiosco_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kiosco_products_id_seq OWNER TO postgres;

--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 233
-- Name: kiosco_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kiosco_products_id_seq OWNED BY public.kiosco_products.id;


--
-- TOC entry 218 (class 1259 OID 16412)
-- Name: liquidaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.liquidaciones (
    id integer NOT NULL,
    mes integer NOT NULL,
    anio integer NOT NULL,
    total_gastos numeric(12,2) DEFAULT 0 NOT NULL,
    total_ingresos numeric(12,2) DEFAULT 0 NOT NULL,
    saldo_final numeric(12,2) DEFAULT 0 NOT NULL,
    creado_en timestamp without time zone DEFAULT now(),
    consorcio_id integer,
    monto_expensa numeric(12,2) DEFAULT 0 NOT NULL,
    propietarios jsonb DEFAULT '[]'::jsonb,
    movimientos jsonb DEFAULT '[]'::jsonb,
    estado text DEFAULT 'Borrador'::text
);


ALTER TABLE public.liquidaciones OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16411)
-- Name: liquidaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.liquidaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.liquidaciones_id_seq OWNER TO postgres;

--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 217
-- Name: liquidaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.liquidaciones_id_seq OWNED BY public.liquidaciones.id;


--
-- TOC entry 222 (class 1259 OID 16440)
-- Name: movimientos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimientos (
    id integer NOT NULL,
    liquidacion_id integer NOT NULL,
    tipo character varying(20) NOT NULL,
    motivo character varying(200),
    monto numeric(12,2) NOT NULL
);


ALTER TABLE public.movimientos OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16439)
-- Name: movimientos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movimientos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movimientos_id_seq OWNER TO postgres;

--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 221
-- Name: movimientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movimientos_id_seq OWNED BY public.movimientos.id;


--
-- TOC entry 216 (class 1259 OID 16400)
-- Name: propietarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.propietarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    unidad character varying(20),
    creado_en timestamp without time zone DEFAULT now(),
    piso text,
    dpto text,
    usuario_id integer,
    apellido character varying(100),
    dni character varying(30),
    telefono character varying(30),
    consorcio_id integer
);


ALTER TABLE public.propietarios OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: propietarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.propietarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.propietarios_id_seq OWNER TO postgres;

--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 215
-- Name: propietarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.propietarios_id_seq OWNED BY public.propietarios.id;


--
-- TOC entry 226 (class 1259 OID 16478)
-- Name: propietarios_liquidaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.propietarios_liquidaciones (
    id integer NOT NULL,
    propietario_id integer,
    liquidacion_id integer,
    expensames numeric(10,2),
    montoabonado numeric(10,2)
);


ALTER TABLE public.propietarios_liquidaciones OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16477)
-- Name: propietarios_liquidaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.propietarios_liquidaciones ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.propietarios_liquidaciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16420)
-- Name: saldos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saldos (
    id integer NOT NULL,
    propietario_id integer NOT NULL,
    liquidacion_id integer NOT NULL,
    monto_expensa numeric(12,2) NOT NULL,
    monto_pagado numeric(12,2) DEFAULT 0,
    creado_en timestamp without time zone DEFAULT now(),
    saldo numeric(12,2) DEFAULT 0 NOT NULL,
    piso text,
    dpto text
);


ALTER TABLE public.saldos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16419)
-- Name: saldos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.saldos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.saldos_id_seq OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 219
-- Name: saldos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.saldos_id_seq OWNED BY public.saldos.id;


--
-- TOC entry 232 (class 1259 OID 16573)
-- Name: solicitudes_unidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitudes_unidad (
    id integer NOT NULL,
    propietario_id integer NOT NULL,
    piso character varying(20),
    dpto character varying(20),
    unidad character varying(50),
    estado character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now()
);


ALTER TABLE public.solicitudes_unidad OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16572)
-- Name: solicitudes_unidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solicitudes_unidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solicitudes_unidad_id_seq OWNER TO postgres;

--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 231
-- Name: solicitudes_unidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solicitudes_unidad_id_seq OWNED BY public.solicitudes_unidad.id;


--
-- TOC entry 228 (class 1259 OID 16504)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(200) NOT NULL,
    role character varying(20) DEFAULT 'PROPIETARIO'::character varying NOT NULL,
    estado character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now()
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16503)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 227
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4806 (class 2604 OID 16455)
-- Name: consorcios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consorcios ALTER COLUMN id SET DEFAULT nextval('public.consorcios_id_seq'::regclass);


--
-- TOC entry 4812 (class 2604 OID 16524)
-- Name: inquilinos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inquilinos ALTER COLUMN id SET DEFAULT nextval('public.inquilinos_id_seq'::regclass);


--
-- TOC entry 4826 (class 2604 OID 16620)
-- Name: kiosco_order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kiosco_order_items ALTER COLUMN id SET DEFAULT nextval('public.kiosco_order_items_id_seq'::regclass);


--
-- TOC entry 4822 (class 2604 OID 16606)
-- Name: kiosco_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kiosco_orders ALTER COLUMN id SET DEFAULT nextval('public.kiosco_orders_id_seq'::regclass);


--
-- TOC entry 4817 (class 2604 OID 16590)
-- Name: kiosco_products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kiosco_products ALTER COLUMN id SET DEFAULT nextval('public.kiosco_products_id_seq'::regclass);


--
-- TOC entry 4792 (class 2604 OID 16415)
-- Name: liquidaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidaciones ALTER COLUMN id SET DEFAULT nextval('public.liquidaciones_id_seq'::regclass);


--
-- TOC entry 4805 (class 2604 OID 16443)
-- Name: movimientos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos ALTER COLUMN id SET DEFAULT nextval('public.movimientos_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 16403)
-- Name: propietarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.propietarios ALTER COLUMN id SET DEFAULT nextval('public.propietarios_id_seq'::regclass);


--
-- TOC entry 4801 (class 2604 OID 16423)
-- Name: saldos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldos ALTER COLUMN id SET DEFAULT nextval('public.saldos_id_seq'::regclass);


--
-- TOC entry 4814 (class 2604 OID 16576)
-- Name: solicitudes_unidad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_unidad ALTER COLUMN id SET DEFAULT nextval('public.solicitudes_unidad_id_seq'::regclass);


--
-- TOC entry 4808 (class 2604 OID 16507)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4846 (class 2606 OID 16458)
-- Name: consorcios consorcios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consorcios
    ADD CONSTRAINT consorcios_pkey PRIMARY KEY (id);


--
-- TOC entry 4854 (class 2606 OID 16527)
-- Name: inquilinos inquilinos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inquilinos
    ADD CONSTRAINT inquilinos_pkey PRIMARY KEY (id);


--
-- TOC entry 4868 (class 2606 OID 16625)
-- Name: kiosco_order_items kiosco_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kiosco_order_items
    ADD CONSTRAINT kiosco_order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4863 (class 2606 OID 16615)
-- Name: kiosco_orders kiosco_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kiosco_orders
    ADD CONSTRAINT kiosco_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4858 (class 2606 OID 16601)
-- Name: kiosco_products kiosco_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kiosco_products
    ADD CONSTRAINT kiosco_products_pkey PRIMARY KEY (id);


--
-- TOC entry 4840 (class 2606 OID 16418)
-- Name: liquidaciones liquidaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidaciones
    ADD CONSTRAINT liquidaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4844 (class 2606 OID 16445)
-- Name: movimientos movimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos
    ADD CONSTRAINT movimientos_pkey PRIMARY KEY (id);


--
-- TOC entry 4836 (class 2606 OID 16410)
-- Name: propietarios propietarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.propietarios
    ADD CONSTRAINT propietarios_email_key UNIQUE (email);


--
-- TOC entry 4848 (class 2606 OID 16482)
-- Name: propietarios_liquidaciones propietarios_liquidaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.propietarios_liquidaciones
    ADD CONSTRAINT propietarios_liquidaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4838 (class 2606 OID 16406)
-- Name: propietarios propietarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.propietarios
    ADD CONSTRAINT propietarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4842 (class 2606 OID 16428)
-- Name: saldos saldos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldos
    ADD CONSTRAINT saldos_pkey PRIMARY KEY (id);


--
-- TOC entry 4856 (class 2606 OID 16580)
-- Name: solicitudes_unidad solicitudes_unidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_unidad
    ADD CONSTRAINT solicitudes_unidad_pkey PRIMARY KEY (id);


--
-- TOC entry 4850 (class 2606 OID 16514)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4852 (class 2606 OID 16512)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4864 (class 1259 OID 16636)
-- Name: idx_kiosco_items_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_kiosco_items_order_id ON public.kiosco_order_items USING btree (order_id);


--
-- TOC entry 4865 (class 1259 OID 16640)
-- Name: idx_kiosco_order_items_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_kiosco_order_items_order_id ON public.kiosco_order_items USING btree (order_id);


--
-- TOC entry 4866 (class 1259 OID 16641)
-- Name: idx_kiosco_order_items_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_kiosco_order_items_product_id ON public.kiosco_order_items USING btree (product_id);


--
-- TOC entry 4859 (class 1259 OID 16638)
-- Name: idx_kiosco_orders_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_kiosco_orders_created_at ON public.kiosco_orders USING btree (created_at);


--
-- TOC entry 4860 (class 1259 OID 16639)
-- Name: idx_kiosco_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_kiosco_orders_status ON public.kiosco_orders USING btree (status);


--
-- TOC entry 4861 (class 1259 OID 16637)
-- Name: idx_kiosco_orders_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_kiosco_orders_user_id ON public.kiosco_orders USING btree (user_id);


--
-- TOC entry 4871 (class 2606 OID 16434)
-- Name: saldos fk_liquidacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldos
    ADD CONSTRAINT fk_liquidacion FOREIGN KEY (liquidacion_id) REFERENCES public.liquidaciones(id) ON DELETE CASCADE;


--
-- TOC entry 4872 (class 2606 OID 16429)
-- Name: saldos fk_propietario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldos
    ADD CONSTRAINT fk_propietario FOREIGN KEY (propietario_id) REFERENCES public.propietarios(id) ON DELETE CASCADE;


--
-- TOC entry 4874 (class 2606 OID 16528)
-- Name: inquilinos inquilinos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inquilinos
    ADD CONSTRAINT inquilinos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4876 (class 2606 OID 16626)
-- Name: kiosco_order_items kiosco_order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kiosco_order_items
    ADD CONSTRAINT kiosco_order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.kiosco_orders(id) ON DELETE CASCADE;


--
-- TOC entry 4877 (class 2606 OID 16631)
-- Name: kiosco_order_items kiosco_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kiosco_order_items
    ADD CONSTRAINT kiosco_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.kiosco_products(id);


--
-- TOC entry 4870 (class 2606 OID 16459)
-- Name: liquidaciones liquidaciones_consorcio_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidaciones
    ADD CONSTRAINT liquidaciones_consorcio_fk FOREIGN KEY (consorcio_id) REFERENCES public.consorcios(id) ON DELETE SET NULL;


--
-- TOC entry 4873 (class 2606 OID 16446)
-- Name: movimientos movimientos_liquidacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos
    ADD CONSTRAINT movimientos_liquidacion_id_fkey FOREIGN KEY (liquidacion_id) REFERENCES public.liquidaciones(id) ON DELETE CASCADE;


--
-- TOC entry 4869 (class 2606 OID 16515)
-- Name: propietarios propietarios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.propietarios
    ADD CONSTRAINT propietarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4875 (class 2606 OID 16581)
-- Name: solicitudes_unidad solicitudes_unidad_propietario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_unidad
    ADD CONSTRAINT solicitudes_unidad_propietario_id_fkey FOREIGN KEY (propietario_id) REFERENCES public.propietarios(id) ON DELETE CASCADE;


-- Completed on 2026-01-20 12:47:25

--
-- PostgreSQL database dump complete
--

\unrestrict DrVSbqsgvBHGxnapqjcb6SoOf1sI4sDWmwwabYfwtWmNDX2P6H7VeRIpUzGKkGz

