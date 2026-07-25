-- ============================================================
-- MIGRACIÓN: TABLA DE COSTOS OPERATIVOS
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. CREAR TABLA costos_operativos
CREATE TABLE IF NOT EXISTS costos_operativos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id   UUID REFERENCES empresas(id) ON DELETE CASCADE,
  negocio      TEXT NOT NULL,
  mes          TEXT NOT NULL,         -- formato 'YYYY-MM'
  tipo         TEXT NOT NULL CHECK (tipo IN ('FIJO', 'MUERTO')),
  descripcion  TEXT NOT NULL,
  valor        NUMERIC(14, 2) NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- 2. ÍNDICE para consultas frecuentes por período y negocio
CREATE INDEX IF NOT EXISTS idx_costos_empresa_mes
  ON costos_operativos (empresa_id, negocio, mes);

-- 3. HABILITAR ROW-LEVEL SECURITY
ALTER TABLE costos_operativos ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICA: solo usuarios autenticados de la misma empresa
DROP POLICY IF EXISTS "costos_empresa_aislamiento" ON costos_operativos;
CREATE POLICY "costos_empresa_aislamiento" ON costos_operativos
  FOR ALL USING (
    empresa_id = (
      SELECT empresa_id FROM profiles
      WHERE id = auth.uid()
      LIMIT 1
    )
  );

-- 5. FUNCIÓN para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_costos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_costos_updated_at ON costos_operativos;
CREATE TRIGGER trg_costos_updated_at
  BEFORE UPDATE ON costos_operativos
  FOR EACH ROW EXECUTE FUNCTION update_costos_updated_at();

-- ============================================================
-- FIN DE MIGRACIÓN
-- ============================================================
