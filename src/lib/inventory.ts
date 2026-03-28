import { supabase } from "./supabase";

export interface Inventario {
  id?: string;
  nombre: string;
  codigo: string;
  cantidad: number;
  precio?: number;
  categoria?: string;
}

export async function getInventario() {
  const { data, error } = await supabase
    .from("inventario")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error al obtener inventario:", error.message);
    throw error;
  }
  return data;
}

export async function addInventario(item: Inventario) {
  const { data, error } = await supabase
    .from("inventario")
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error("Error al agregar al inventario:", error.message);
    throw error;
  }
  return data;
}

export async function updateInventario(id: string, item: Partial<Inventario>) {
  const { data, error } = await supabase
    .from("inventario")
    .update(item)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar inventario:", error.message);
    throw error;
  }
  return data;
}

export async function deleteInventario(id: string) {
  const { error } = await supabase
    .from("inventario")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar inventario:", error.message);
    throw error;
  }
  return true;
}
