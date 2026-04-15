-- ============================================================
-- SCRIPT COMPLETO MULTI-TENANT — Un solo script, orden correcto
-- Ejecutar en Supabase SQL Editor (pegar todo de una vez)
-- ============================================================

-- ─── PASO 1: CREAR TABLAS NUEVAS ──────────────────────────────

CREATE TABLE IF NOT EXISTS empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email_contacto TEXT,
  plan TEXT NOT NULL DEFAULT 'basico',
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS planes_empresa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  modulo_inventario BOOLEAN DEFAULT true,
  modulo_trabajadores BOOLEAN DEFAULT true,
  modulo_personal BOOLEAN DEFAULT false,
  modulo_reportes BOOLEAN DEFAULT false,
  modulo_pagos BOOLEAN DEFAULT false,
  modulo_subida_masiva BOOLEAN DEFAULT true,
  limite_usuarios INT DEFAULT 3,
  limite_negocios INT DEFAULT 1,
  UNIQUE(empresa_id)
);

-- ─── PASO 2: AGREGAR empresa_id A TODAS LAS TABLAS ───────────
-- (IF NOT EXISTS evita error si ya existen)

ALTER TABLE profiles          ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id);
ALTER TABLE trabajadores      ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id);
ALTER TABLE inventario        ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id);
ALTER TABLE negocios          ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id);
ALTER TABLE personal          ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id);
ALTER TABLE pagos_trabajadores ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id);

-- ─── PASO 3: AGREGAR ROL superadmin A profiles (si no existe) ─
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'trabajador';

-- ─── PASO 4: FUNCIONES AUXILIARES PARA RLS ───────────────────

CREATE OR REPLACE FUNCTION get_my_empresa_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT empresa_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- ─── PASO 5: RLS — EMPRESAS ───────────────────────────────────

ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "usuarios ven su empresa"     ON empresas;
DROP POLICY IF EXISTS "superadmin ve todas"          ON empresas;
DROP POLICY IF EXISTS "superadmin inserta empresas"  ON empresas;
DROP POLICY IF EXISTS "superadmin actualiza empresas" ON empresas;
DROP POLICY IF EXISTS "superadmin elimina empresas"  ON empresas;

CREATE POLICY "usuarios ven su empresa"
  ON empresas FOR SELECT TO authenticated
  USING (id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "superadmin inserta empresas"
  ON empresas FOR INSERT TO authenticated
  WITH CHECK (get_my_role() = 'superadmin');

CREATE POLICY "superadmin actualiza empresas"
  ON empresas FOR UPDATE TO authenticated
  USING (get_my_role() = 'superadmin');

CREATE POLICY "superadmin elimina empresas"
  ON empresas FOR DELETE TO authenticated
  USING (get_my_role() = 'superadmin');

-- ─── PASO 6: RLS — PLANES_EMPRESA ────────────────────────────

ALTER TABLE planes_empresa ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "usuarios ven su plan"            ON planes_empresa;
DROP POLICY IF EXISTS "superadmin ve todos los planes"  ON planes_empresa;
DROP POLICY IF EXISTS "superadmin inserta planes"       ON planes_empresa;
DROP POLICY IF EXISTS "superadmin actualiza planes"     ON planes_empresa;
DROP POLICY IF EXISTS "superadmin elimina planes"       ON planes_empresa;

CREATE POLICY "usuarios ven su plan"
  ON planes_empresa FOR SELECT TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "superadmin inserta planes"
  ON planes_empresa FOR INSERT TO authenticated
  WITH CHECK (get_my_role() = 'superadmin');

CREATE POLICY "superadmin actualiza planes"
  ON planes_empresa FOR UPDATE TO authenticated
  USING (get_my_role() = 'superadmin');

CREATE POLICY "superadmin elimina planes"
  ON planes_empresa FOR DELETE TO authenticated
  USING (get_my_role() = 'superadmin');

-- ─── PASO 7: RLS — PROFILES ──────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "usuarios ven su perfil"             ON profiles;
DROP POLICY IF EXISTS "usuarios actualizan su perfil"      ON profiles;
DROP POLICY IF EXISTS "superadmin gestiona perfiles"       ON profiles;

CREATE POLICY "usuarios ven su perfil"
  ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR get_my_role() = 'superadmin');

CREATE POLICY "usuarios actualizan su perfil"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR get_my_role() = 'superadmin');

-- ─── PASO 8: RLS — TRABAJADORES ──────────────────────────────

ALTER TABLE trabajadores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "trabajadores select" ON trabajadores;
DROP POLICY IF EXISTS "trabajadores insert" ON trabajadores;
DROP POLICY IF EXISTS "trabajadores update" ON trabajadores;
DROP POLICY IF EXISTS "trabajadores delete" ON trabajadores;

CREATE POLICY "trabajadores select"
  ON trabajadores FOR SELECT TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "trabajadores insert"
  ON trabajadores FOR INSERT TO authenticated
  WITH CHECK (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "trabajadores update"
  ON trabajadores FOR UPDATE TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "trabajadores delete"
  ON trabajadores FOR DELETE TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

-- ─── PASO 9: RLS — INVENTARIO ────────────────────────────────

ALTER TABLE inventario ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "inventario select" ON inventario;
DROP POLICY IF EXISTS "inventario insert" ON inventario;
DROP POLICY IF EXISTS "inventario update" ON inventario;
DROP POLICY IF EXISTS "inventario delete" ON inventario;

CREATE POLICY "inventario select"
  ON inventario FOR SELECT TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "inventario insert"
  ON inventario FOR INSERT TO authenticated
  WITH CHECK (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "inventario update"
  ON inventario FOR UPDATE TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "inventario delete"
  ON inventario FOR DELETE TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

-- ─── PASO 10: RLS — NEGOCIOS ─────────────────────────────────

ALTER TABLE negocios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "negocios select" ON negocios;
DROP POLICY IF EXISTS "negocios insert" ON negocios;
DROP POLICY IF EXISTS "negocios update" ON negocios;
DROP POLICY IF EXISTS "negocios delete" ON negocios;

CREATE POLICY "negocios select"
  ON negocios FOR SELECT TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "negocios insert"
  ON negocios FOR INSERT TO authenticated
  WITH CHECK (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "negocios update"
  ON negocios FOR UPDATE TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "negocios delete"
  ON negocios FOR DELETE TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

-- ─── PASO 11: RLS — PERSONAL ─────────────────────────────────

ALTER TABLE personal ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "personal select" ON personal;
DROP POLICY IF EXISTS "personal insert" ON personal;
DROP POLICY IF EXISTS "personal update" ON personal;
DROP POLICY IF EXISTS "personal delete" ON personal;

CREATE POLICY "personal select"
  ON personal FOR SELECT TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "personal insert"
  ON personal FOR INSERT TO authenticated
  WITH CHECK (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "personal update"
  ON personal FOR UPDATE TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "personal delete"
  ON personal FOR DELETE TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

-- ─── PASO 12: RLS — PAGOS_TRABAJADORES ───────────────────────

ALTER TABLE pagos_trabajadores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pagos select" ON pagos_trabajadores;
DROP POLICY IF EXISTS "pagos insert" ON pagos_trabajadores;
DROP POLICY IF EXISTS "pagos update" ON pagos_trabajadores;
DROP POLICY IF EXISTS "pagos delete" ON pagos_trabajadores;

CREATE POLICY "pagos select"
  ON pagos_trabajadores FOR SELECT TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "pagos insert"
  ON pagos_trabajadores FOR INSERT TO authenticated
  WITH CHECK (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "pagos update"
  ON pagos_trabajadores FOR UPDATE TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

CREATE POLICY "pagos delete"
  ON pagos_trabajadores FOR DELETE TO authenticated
  USING (empresa_id = get_my_empresa_id() OR get_my_role() = 'superadmin');

-- ============================================================
-- FIN — Ahora corre los INSERT/UPDATE de datos del archivo
--       supabase_migration.sql (pasos 4 al 8)
-- ============================================================
