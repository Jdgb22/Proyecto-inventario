import { supabase } from "./supabase";
import { getCurrentEmpresaId } from "./empresas";

export interface CostoOperativo {
  id?: string;
  empresa_id?: string;
  negocio: string;
  mes: string;
  /** "FIJO" = arriendo/contrato/servicio | "MUERTO" = merma/daño/desperdicio */
  tipo: "FIJO" | "MUERTO";
  descripcion: string;
  valor: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Retorna todos los costos operativos para un negocio y mes dados.
 * Si negocio === "GLOBAL" no filtra por negocio.
 */
export async function getCostosOperativos(
  negocio: string,
  mes: string
): Promise<CostoOperativo[]> {
  const empresaId = await getCurrentEmpresaId();
  let query = supabase
    .from("costos_operativos")
    .select("*")
    .eq("mes", mes)
    .order("tipo", { ascending: true })
    .order("descripcion", { ascending: true });

  if (negocio && negocio !== "GLOBAL") {
    query = query.eq("negocio", negocio);
  }
  if (empresaId) query = query.eq("empresa_id", empresaId);

  const { data, error } = await query;
  if (error) throw error;
  return (data as CostoOperativo[]) || [];
}

/**
 * Agrega un nuevo costo operativo.
 */
export async function addCosto(
  item: Omit<CostoOperativo, "id" | "empresa_id" | "created_at" | "updated_at">
): Promise<CostoOperativo> {
  const empresaId = await getCurrentEmpresaId();
  const payload: any = {
    negocio: item.negocio,
    mes: item.mes,
    tipo: item.tipo,
    descripcion: item.descripcion.trim(),
    valor: item.valor,
  };
  if (empresaId) payload.empresa_id = empresaId;

  const { data, error } = await supabase
    .from("costos_operativos")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data as CostoOperativo;
}

/**
 * Actualiza descripción y/o valor de un costo existente.
 */
export async function updateCosto(
  id: string,
  changes: Partial<Pick<CostoOperativo, "descripcion" | "valor" | "tipo">>
): Promise<CostoOperativo> {
  const { data, error } = await supabase
    .from("costos_operativos")
    .update(changes)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as CostoOperativo;
}

/**
 * Elimina un registro de costo operativo.
 */
export async function deleteCosto(id: string): Promise<void> {
  const { error } = await supabase
    .from("costos_operativos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
