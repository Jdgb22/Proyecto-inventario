import { supabase } from "./supabase";

export interface Negocio {
  id: string;
  nombre: string;
  created_at: string;
}

export async function getNegocios() {
  const { data, error } = await supabase
    .from("negocios")
    .select("*")
    .order("nombre", { ascending: true });

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
  const { data, error } = await supabase
    .from("negocios")
    .insert([{ 
      nombre: nombre.trim()
    }])
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
