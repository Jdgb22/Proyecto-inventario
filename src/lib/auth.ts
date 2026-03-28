import { supabase } from "./supabase";

/**
 * Registra un nuevo usuario en Supabase con correo y contraseña.
 */
export async function signUpUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Error al crear el usuario:", error.message);
    throw error;
  }

  return data;
}

/**
 * Inicia sesión con un usuario existente.
 */
export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error al iniciar sesión:", error.message);
    throw error;
  }

  return data;
}

/**
 * Cierra la sesión activa.
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error al cerrar sesión:", error.message);
    throw error;
  }
}

/**
 * Obtiene la sesión actual del usuario.
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {    
    console.error("Error al obtener la sesión:", error.message);
    throw error;
  }
  return data.session;
}

/**
 * Obtiene el rol del usuario desde la tabla profiles.
 */
export async function getUserRole(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error al obtener el rol del usuario:", error.message);
    return null;
  }

  return data?.role || null;
}
