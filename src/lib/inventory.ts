import { supabase } from "./supabase";

export interface MasterProducto {
  id?: string;
  nombre: string;
  codigo: string;
  categoria: string;
  precio: number;
}

export interface StockEntry {
  id?: string;
  codigo: string;
  cantidad: number;
  negocio: string;
  mes: string;
  nombre?: string;
  precio?: number;
  categoria?: string;
}

/** 
 * GESTIÓN DE BASE DE DATOS MAESTRA (PRODUCTOS)
 */
export async function getMasterProductos() {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      // Si la tabla no existe o hay un error de permisos, intentamos el fallback
      console.warn("ADVERTENCIA DE TABLA: Intentando fallback a inventario [MASTER]", error.message);
      
      const { data: fallback, error: err2 } = await supabase
          .from("inventario")
          .select("*")
          .eq("mes", "MASTER")
          .order("nombre", { ascending: true });
          
      if (err2) {
        console.error("ERROR CRÍTICO: Fallback fallido", err2.message);
        throw new Error(`Base de datos inaccesible: ${err2.message}`);
      }
      return fallback || [];
    }
    return data || [];
  } catch (e: any) {
    console.error("EXCEPCIÓN EN BASE DE DATOS:", e);
    throw e;
  }
}

export async function upsertMasterProducto(item: MasterProducto) {
    const { data: exist } = await supabase
        .from("inventario")
        .select("*")
        .eq("codigo", item.codigo)
        .eq("mes", "MASTER")
        .maybeSingle();

    if (exist) {
        const { data, error } = await supabase
            .from("inventario")
            .update({
                nombre: item.nombre.trim(),
                precio: item.precio,
                categoria: item.categoria?.trim() || ""
            })
            .eq("id", exist.id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        const { data, error } = await supabase
            .from("inventario")
            .insert([{
                nombre: item.nombre.trim(),
                codigo: item.codigo.trim(),
                precio: item.precio,
                categoria: item.categoria?.trim() || "",
                cantidad: 0,
                negocio: "GLOBAL",
                mes: "MASTER"
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
}

/** 
 * GESTIÓN DE INVENTARIO MENSUAL (EXISTENCIAS)
 */
export async function getStockFiltrado(negocio: string, mes: string) {
    let query = supabase.from("inventario").select("*").eq("mes", mes);
    if (negocio && negocio !== "GLOBAL") {
        query = query.eq("negocio", negocio);
    }
    
    const { data: stock, error } = await query;
    if (error) throw error;
    return stock || [];
}

export async function getInventario() {
    const { data, error } = await supabase
        .from("inventario")
        .select("*")
        .neq("mes", "MASTER");

    if (error) throw error;
    return data || [];
}

export async function addStockEntry(item: StockEntry) {
    // Buscamos si ya existe una entrada para este código, negocio y mes
    const { data: exist } = await supabase
        .from("inventario")
        .select("*")
        .eq("codigo", item.codigo)
        .eq("negocio", item.negocio)
        .eq("mes", item.mes)
        .maybeSingle();

    if (exist) {
        const { data, error } = await supabase
            .from("inventario")
            .update({ cantidad: item.cantidad })
            .eq("id", exist.id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        // Necesitamos traer el nombre y precio del MASTER para que el registro sea completo visualmente
        const { data: master } = await supabase
            .from("inventario")
            .select("*")
            .eq("codigo", item.codigo)
            .eq("mes", "MASTER")
            .maybeSingle();

        const { data, error } = await supabase
            .from("inventario")
            .insert([{
                nombre: item.nombre || master?.nombre || "Producto Desconocido",
                codigo: item.codigo.trim(),
                precio: item.precio ?? master?.precio ?? 0,
                categoria: item.categoria || master?.categoria || "",
                cantidad: item.cantidad,
                negocio: item.negocio,
                mes: item.mes
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
}

export async function deleteRegistro(id: string) {
    const { error } = await supabase.from("inventario").delete().eq("id", id);
    if (error) throw error;
    return true;
}

export async function deleteMasterProducto(id: string) {
    // En nuestro sistema actual, los productos master están en la tabla 'inventario' con mes='MASTER'
    // o en la tabla 'productos' si ya se migró. deleteRegistro ya maneja el ID.
    return await deleteRegistro(id);
}

export async function updateStockEntry(id: string, cantidad: number) {
    const { data, error } = await supabase
        .from("inventario")
        .update({ cantidad })
        .eq("id", id)
        .select()
        .single();
        
    if (error) throw error;
    return data;
}
