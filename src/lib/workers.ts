import { supabase } from "./supabase";

export interface Trabajador {
  id?: string;
  nombre: string;
  documento: string;
  telefono?: string;
  cargo?: string;
  salario_base?: number;
}

export interface PagoTrabajador {
  id?: string;
  trabajador_id: string;
  monto: number;
  fecha_pago?: string;
  metodo_pago: string;
  descripcion?: string;
}

// --- TRABAJADORES ---

export async function getTrabajadores() {
  const { data, error } = await supabase
    .from("trabajadores")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error al obtener trabajadores:", error.message);
    throw error;
  }
  return data;
}

export async function addTrabajador(trabajador: Trabajador) {
  const { data, error } = await supabase
    .from("trabajadores")
    .insert([trabajador])
    .select()
    .single();

  if (error) {
    console.error("Error al agregar trabajador:", error.message);
    throw error;
  }
  return data;
}

export async function updateTrabajador(id: string, trabajador: Partial<Trabajador>) {
  const { data, error } = await supabase
    .from("trabajadores")
    .update(trabajador)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar trabajador:", error.message);
    throw error;
  }
  return data;
}

export async function deleteTrabajador(id: string) {
  const { error } = await supabase
    .from("trabajadores")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar trabajador:", error.message);
    throw error;
  }
  return true;
}

// --- PAGOS ---

export async function getPagos(trabajadorId?: string) {
  let query = supabase.from("pagos_trabajadores").select("*, trabajadores(nombre, documento)");
  
  if (trabajadorId) {
    query = query.eq("trabajador_id", trabajadorId);
  }

  const { data, error } = await query.order("fecha_pago", { ascending: false });

  if (error) {
    console.error("Error al obtener pagos:", error.message);
    throw error;
  }
  return data;
}

export async function addPago(pago: PagoTrabajador) {
  const { data, error } = await supabase
    .from("pagos_trabajadores")
    .insert([pago])
    .select()
    .single();

  if (error) {
    console.error("Error al registrar pago:", error.message);
    throw error;
  }
  return data;
}
