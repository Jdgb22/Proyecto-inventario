import { supabase } from "./supabase";

export interface Empresa {
  id: string;
  nombre: string;
  email_contacto?: string;
  plan: string;
  activo: boolean;
  created_at: string;
  planes_empresa?: PlanEmpresa[];
}

export interface PlanEmpresa {
  id?: string;
  empresa_id: string;
  modulo_inventario: boolean;
  modulo_trabajadores: boolean;
  modulo_personal: boolean;
  modulo_reportes: boolean;
  modulo_pagos: boolean;
  modulo_subida_masiva: boolean;
  limite_usuarios: number;
  limite_negocios: number;
}

// Cache de sesión actual para evitar múltiples consultas
let _cachedEmpresaId: string | null = null;
let _cachedPlan: PlanEmpresa | null = null;

/**
 * Retorna el empresa_id del usuario actual (con caché).
 * Llama a clearEmpresaCache() al cerrar sesión.
 */
export async function getCurrentEmpresaId(): Promise<string | null> {
  if (_cachedEmpresaId) return _cachedEmpresaId;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("empresa_id")
    .eq("id", session.user.id)
    .single();

  if (error || !data?.empresa_id) return null;
  _cachedEmpresaId = data.empresa_id;
  return _cachedEmpresaId;
}

/**
 * Retorna el plan/feature-flags de la empresa actual (con caché).
 */
export async function getCurrentPlan(): Promise<PlanEmpresa | null> {
  if (_cachedPlan) return _cachedPlan;

  const empresaId = await getCurrentEmpresaId();
  if (!empresaId) return null;

  const { data, error } = await supabase
    .from("planes_empresa")
    .select("*")
    .eq("empresa_id", empresaId)
    .single();

  if (error || !data) return null;
  _cachedPlan = data;
  return data;
}

/**
 * Limpia la caché al cerrar sesión.
 */
export function clearEmpresaCache() {
  _cachedEmpresaId = null;
  _cachedPlan = null;
}

// ─── FUNCIONES DE SUPERADMIN ─────────────────────────────────

/**
 * Retorna todas las empresas con sus planes (solo superadmin).
 */
export async function getAllEmpresas(): Promise<Empresa[]> {
  const { data, error } = await supabase
    .from("empresas")
    .select("*, planes_empresa(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Crea una nueva empresa con su plan base.
 */
export async function createEmpresa(
  nombre: string,
  emailContacto: string,
  plan: string
): Promise<Empresa> {
  const { data, error } = await supabase
    .from("empresas")
    .insert([{ nombre, email_contacto: emailContacto, plan }])
    .select()
    .single();

  if (error) throw error;

  // Crear flags de plan por defecto
  await supabase.from("planes_empresa").insert([
    {
      empresa_id: data.id,
      modulo_inventario: true,
      modulo_trabajadores: plan !== "basico",
      modulo_personal: plan === "enterprise",
      modulo_reportes: plan !== "basico",
      modulo_pagos: plan === "enterprise",
      modulo_subida_masiva: true,
      limite_usuarios: plan === "basico" ? 3 : plan === "pro" ? 10 : 100,
      limite_negocios: plan === "basico" ? 1 : plan === "pro" ? 5 : 100,
    },
  ]);

  return data;
}

/**
 * Activa o desactiva una empresa.
 */
export async function toggleEmpresaActivo(
  empresaId: string,
  activo: boolean
): Promise<void> {
  const { error } = await supabase
    .from("empresas")
    .update({ activo })
    .eq("id", empresaId);

  if (error) throw error;
}

/**
 * Actualiza los feature flags de una empresa.
 */
export async function updatePlanEmpresa(
  empresaId: string,
  flags: Partial<PlanEmpresa>
): Promise<void> {
  const { error } = await supabase
    .from("planes_empresa")
    .update(flags)
    .eq("empresa_id", empresaId);

  if (error) throw error;
}

/**
 * Elimina una empresa y todos sus datos relacionados (cascade).
 */
export async function deleteEmpresa(empresaId: string): Promise<void> {
  const { error } = await supabase
    .from("empresas")
    .delete()
    .eq("id", empresaId);

  if (error) throw error;
}
