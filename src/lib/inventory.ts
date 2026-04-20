import { supabase } from "./supabase";
import { getCurrentEmpresaId } from "./empresas";

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
    const empresaId = await getCurrentEmpresaId();
    let query = supabase.from("productos").select("*");
    if (empresaId) query = query.eq("empresa_id", empresaId);
    const { data, error } = await query.order("nombre", { ascending: true });

    if (error) {
      console.warn("ADVERTENCIA DE TABLA: Intentando fallback a inventario [MASTER]", error.message);
      
      let fbQuery = supabase
          .from("inventario")
          .select("*")
          .eq("mes", "MASTER");
      if (empresaId) fbQuery = fbQuery.eq("empresa_id", empresaId);
      const { data: fallback, error: err2 } = await fbQuery.order("nombre", { ascending: true });
          
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
    const empresaId = await getCurrentEmpresaId();
    
    // 1. Intentar con la tabla nueva "productos"
    let checkQuery = supabase.from("productos").select("*").eq("codigo", item.codigo);
    if (empresaId) checkQuery = checkQuery.eq("empresa_id", empresaId);
    
    const { data: existProd, error: fetchErr } = await checkQuery.maybeSingle();

    if (!fetchErr) {
        // La tabla existe, trabajamos con 'productos'
        if (existProd) {
            const { data, error } = await supabase
                .from("productos")
                .update({
                    nombre: item.nombre.trim(),
                    precio: item.precio,
                    categoria: item.categoria?.trim() || ""
                })
                .eq("id", existProd.id)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            const payload: any = {
                nombre: item.nombre.trim(),
                codigo: item.codigo.trim(),
                precio: item.precio,
                categoria: item.categoria?.trim() || ""
            };
            if (empresaId) payload.empresa_id = empresaId;
            
            const { data, error } = await supabase
                .from("productos")
                .insert([payload])
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    }

    // 2. Fallback al sistema viejo "inventario [MASTER]"
    let fbExistQ = supabase.from("inventario").select("*").eq("codigo", item.codigo).eq("mes", "MASTER");
    if (empresaId) fbExistQ = fbExistQ.eq("empresa_id", empresaId);
    const { data: existMaster } = await fbExistQ.maybeSingle();

    if (existMaster) {
        const { data, error } = await supabase
            .from("inventario")
            .update({
                nombre: item.nombre.trim(),
                precio: item.precio,
                categoria: item.categoria?.trim() || ""
            })
            .eq("id", existMaster.id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        const payloadFb: any = {
            nombre: item.nombre.trim(),
            codigo: item.codigo.trim(),
            precio: item.precio,
            categoria: item.categoria?.trim() || "",
            cantidad: 0,
            negocio: "GLOBAL",
            mes: "MASTER"
        };
        if (empresaId) payloadFb.empresa_id = empresaId;
        
        const { data, error } = await supabase
            .from("inventario")
            .insert([payloadFb])
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
    const empresaId = await getCurrentEmpresaId();
    let query = supabase.from("inventario").select("*").eq("mes", mes);
    if (negocio && negocio !== "GLOBAL") {
        query = query.eq("negocio", negocio);
    }
    if (empresaId) query = query.eq("empresa_id", empresaId);
    
    const { data: stock, error } = await query;
    if (error) throw error;
    return stock || [];
}

export async function getInventario() {
    const empresaId = await getCurrentEmpresaId();
    let query = supabase.from("inventario").select("*").neq("mes", "MASTER");
    if (empresaId) query = query.eq("empresa_id", empresaId);
    const { data, error } = await query;

    if (error) throw error;
    return data || [];
}

export async function addStockEntry(item: StockEntry) {
    const empresaId = await getCurrentEmpresaId();
    // Buscamos si ya existe una entrada para este código, negocio y mes
    let existQuery = supabase
        .from("inventario")
        .select("*")
        .eq("codigo", item.codigo)
        .eq("negocio", item.negocio)
        .eq("mes", item.mes);
    if (empresaId) existQuery = existQuery.eq("empresa_id", empresaId);
    const { data: exist } = await existQuery.maybeSingle();

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
        let masterQuery = supabase
            .from("inventario")
            .select("*")
            .eq("codigo", item.codigo)
            .eq("mes", "MASTER");
        if (empresaId) masterQuery = masterQuery.eq("empresa_id", empresaId);
        const { data: master } = await masterQuery.maybeSingle();

        const insertPayload: any = {
            nombre: item.nombre || master?.nombre || "Producto Desconocido",
            codigo: item.codigo.trim(),
            precio: item.precio ?? master?.precio ?? 0,
            categoria: item.categoria || master?.categoria || "",
            cantidad: item.cantidad,
            negocio: item.negocio,
            mes: item.mes,
        };
        if (empresaId) insertPayload.empresa_id = empresaId;

        const { data, error } = await supabase
            .from("inventario")
            .insert([insertPayload])
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
    // Intenta borrar primero de 'productos' si existe
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (!error) return true;
    
    // Si falló, asume fallback a inventario
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
