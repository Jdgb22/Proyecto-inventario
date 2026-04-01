import { supabase } from "./supabase";

export interface Inventario {
  id?: string;
  nombre: string;
  codigo: string;
  cantidad: number;
  precio?: number;
  categoria?: string;
  negocio?: string;
  mes?: string; 
}

/** 
 * Obtener todos los productos Maestros (donde se define precio, categoria, etc.)
 */
export async function getMasterProductos() {
  const { data, error } = await supabase
    .from("inventario")
    .select("*")
    .eq("negocio", "MASTER")
    .order("nombre", { ascending: true });

  if (error) {
    console.warn("Error select MASTER:", error.message);
    return [];
  }
  return data;
}

/** 
 * Actualizar o Crear un Producto Maestro (Manual Upsert para evitar error de constraint)
 */
export async function upsertMasterProducto(item: any) {
  // Primero buscamos si ya existe el maestro para ese código
  const { data: existing, error: selectError } = await supabase
    .from("inventario")
    .select("id")
    .eq("codigo", item.codigo)
    .eq("negocio", "MASTER")
    .eq("mes", "MASTER")
    .maybeSingle();

  if (selectError) throw selectError;

  const payload = { 
    ...item, 
    negocio: "MASTER", 
    mes: "MASTER", 
    cantidad: 0 
  };

  if (existing) {
    // Si existe, actualizamos
    const { data, error } = await supabase
      .from("inventario")
      .update(payload)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    // Si no existe, insertamos
    const { data, error } = await supabase
      .from("inventario")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

/**
 * Obtener entrada de stock específica para negocio/mes/código
 */
export async function getStockEntry(codigo: string, negocio: string, mes: string) {
  const { data, error } = await supabase
    .from("inventario")
    .select("*")
    .eq("codigo", codigo)
    .eq("negocio", negocio)
    .eq("mes", mes)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

/** 
 * Obtener existencias (Stock) para un negocio y mes específico
 */
export async function getStockFiltrado(negocio: string, mes: string) {
  const { data, error } = await supabase
    .from("inventario")
    .select("*")
    .eq("negocio", negocio)
    .eq("mes", mes)
    .order("codigo", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getInventario() {
  const { data, error } = await supabase
    .from("inventario")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data;
}

export async function addInventario(item: Inventario) {
  const { data, error } = await supabase
    .from("inventario")
    .insert([item])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInventario(id: string, item: Partial<Inventario>) {
  const { data, error } = await supabase
    .from("inventario")
    .update(item)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInventario(id: string) {
  const { error } = await supabase
    .from("inventario")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
