import { supabase } from "./supabase";

export interface Personal {
  id?: string;
  nombre: string;
  documento: string;
  cargo?: string | null;
  salario_base?: number;
  negocio?: string | null;
  fecha_entrada?: string | null;
  prima?: boolean;
  fecha_prima?: string | null;
  liquidacion?: boolean;
  fecha_liquidacion?: string | null;
  cesantias?: boolean;
  fecha_cesantias?: string | null;
}

export async function getPersonalFiltrado(negocio?: string) {
  try {
    let query = supabase.from("personal").select("*");
    if (negocio) query = query.eq("negocio", negocio);
    const { data, error } = await query.order("nombre", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener personal filtrado:", error);
    return [];
  }
}

export async function addPersonal(persona: Personal) {
  const { data, error } = await supabase
    .from("personal")
    .upsert([persona], { onConflict: 'documento' })
    .select()
    .single();

  if (error) {
    console.error("Error al agregar personal:", error);
    throw error;
  }
  return data;
}

export async function updatePersonal(id: string, persona: Partial<Personal>) {
  const { data, error } = await supabase
    .from("personal")
    .update(persona)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar personal:", error);
    throw error;
  }
  return data;
}

export async function deletePersonal(id: string) {
  const { error } = await supabase
    .from("personal")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar personal:", error);
    throw error;
  }
  return true;
}
