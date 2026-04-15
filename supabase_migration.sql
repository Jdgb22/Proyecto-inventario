-- ============================================================
-- MIGRACIÓN MULTI-TENANT — Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. TABLA DE EMPRESAS (clientes compradores)
CREATE TABLE IF NOT EXISTS empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email_contacto TEXT,
  plan TEXT NOT NULL DEFAULT 'basico', -- 'basico' | 'pro' | 'enterprise'
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLA DE PLANES / FEATURE FLAGS POR EMPRESA
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

-- 3. AGREGAR empresa_id A TABLAS EXISTENTES
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id);
ALTER TABLE trabajadores ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id);
ALTER TABLE inventario ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id);
ALTER TABLE negocios ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id);
ALTER TABLE personal ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id);
ALTER TABLE pagos_trabajadores ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id);

-- 4. CREAR TU EMPRESA ACTUAL (empresa principal / empresa #1)
-- *** CAMBIA el nombre y correo por los tuyos ***
INSERT INTO empresas (nombre, email_contacto, plan)
VALUES ('Mi Empresa', 'admin@miempresa.com', 'enterprise')
RETURNING id;
-- Copia el ID que salga arriba y úsalo en los pasos siguientes

-- 5. INSERTAR PLAN COMPLETO (enterprise = todo activo) PARA TU EMPRESA
-- *** Reemplaza 'EMPRESA_ID_AQUI' con el UUID del paso anterior ***
INSERT INTO planes_empresa (
  empresa_id,
  modulo_inventario,
  modulo_trabajadores,
  modulo_personal,
  modulo_reportes,
  modulo_pagos,
  modulo_subida_masiva,
  limite_usuarios,
  limite_negocios
) VALUES (
  'EMPRESA_ID_AQUI',
  true, true, true, true, true, true,
  100, 100
);

-- 6. VINCULAR TODOS LOS USUARIOS ACTUALES A TU EMPRESA
-- *** Reemplaza 'EMPRESA_ID_AQUI' con el UUID del paso anterior ***
UPDATE profiles SET empresa_id = 'EMPRESA_ID_AQUI' WHERE empresa_id IS NULL;

-- 7. VINCULAR TODOS LOS DATOS EXISTENTES A TU EMPRESA
-- *** Reemplaza 'EMPRESA_ID_AQUI' con el UUID del paso anterior ***
UPDATE trabajadores SET empresa_id = 'EMPRESA_ID_AQUI' WHERE empresa_id IS NULL;
UPDATE inventario SET empresa_id = 'EMPRESA_ID_AQUI' WHERE empresa_id IS NULL;
UPDATE negocios SET empresa_id = 'EMPRESA_ID_AQUI' WHERE empresa_id IS NULL;
UPDATE personal SET empresa_id = 'EMPRESA_ID_AQUI' WHERE empresa_id IS NULL;
UPDATE pagos_trabajadores SET empresa_id = 'EMPRESA_ID_AQUI' WHERE empresa_id IS NULL;

-- 8. AGREGAR ROL superadmin A TU USUARIO ADMINISTRADOR
-- *** Reemplaza 'TU_USER_ID' con el UUID de tu usuario en auth.users ***
UPDATE profiles SET role = 'superadmin' WHERE id = 'TU_USER_ID';

-- ============================================================
-- FIN DE MIGRACIÓN
-- ============================================================
