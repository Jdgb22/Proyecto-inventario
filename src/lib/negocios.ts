import { supabase } from "./supabase";
import { getCurrentEmpresaId } from "./empresas";

export interface Negocio {
  id: string;
  nombre: string;
  created_at: string;
}

export async function getNegocios() {
  const empresaId = await getCurrentEmpresaId();
  let query = supabase.from("negocios").select("*");
  if (empresaId) query = query.eq("empresa_id", empresaId);
  const { data, error } = await query.order("nombre", { ascending: true });

  if (error) {
    console.error("Error al obtener negocios:", error.message);
    // Fallback: Si la tabla no existe, devolveremos un array vacío para no romper la app
    if (error.code === 'PGRST116' || error.message.includes('relation "negocios" does not exist')) {
      return [];
    }
    throw error;
  }
  return data || [];
}

export async function addNegocio(nombre: string) {
  const empresaId = await getCurrentEmpresaId();
  const payload: any = { nombre: nombre.trim() };
  if (empresaId) payload.empresa_id = empresaId;
  const { data, error } = await supabase
    .from("negocios")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Error al añadir negocio:", error.message);
    throw error;
  }
  return data;
}

export async function deleteNegocio(id: string) {
  const { error } = await supabase
    .from("negocios")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar negocio:", error.message);
    throw error;
  }
  return true;
}

// Función para poblar la tabla inicialmente con negocios existentes en otras tablas
export async function migrateNegocios(uniqueNames: string[]) {
  const jobs = uniqueNames.map(nombre => addNegocio(nombre).catch(() => null));
  await Promise.all(jobs);
}

export async function updateNegocio(id: string, nombre: string) {
  const { data, error } = await supabase
    .from("negocios")
    .update({ nombre: nombre.trim() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar negocio:", error.message);
    throw error;
  }
  return data;
}
