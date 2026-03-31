import { supabase } from "./supabase";

export interface Inventario {
  id?: string;
  nombre: string;
  codigo: string;
  cantidad: number;
  precio?: number;
  categoria?: string;
  // Campos opcionales para manejar historial por negocio y mes.
  // Si tu tabla actual no los tiene, el frontend hará fallback automático.
  negocio?: string;
  mes?: string; // Idealmente "YYYY-MM"
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

export async function getInventarioFiltrado(negocio?: string, mes?: string) {
  try {
    let query = supabase.from("inventario").select("*");
    if (negocio) query = query.eq("negocio", negocio);
    if (mes) query = query.eq("mes", mes);
    const { data, error } = await query.order("nombre", { ascending: true });

    if (error) {
      // Si la tabla no tiene esas columnas todavía, devolvemos la consulta completa.
      console.warn("getInventarioFiltrado fallback:", error.message);
      return await getInventario();
    }
    return data;
  } catch (error) {
    console.warn("getInventarioFiltrado fallback (catch):", error);
    return await getInventario();
  }
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
