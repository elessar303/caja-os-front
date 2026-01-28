import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Instancia única del cliente de Supabase (singleton)
 * Se reutiliza en toda la aplicación para evitar múltiples instancias
 * que pueden causar problemas de comportamiento indefinido.
 */
let supabaseInstance: SupabaseClient | null = null;

/**
 * Obtiene la instancia única del cliente de Supabase
 * Las variables de entorno deben estar definidas en el archivo .env
 *
 * @returns Cliente de Supabase configurado (instancia única)
 */
const supabaseClient = (): SupabaseClient => {
  // Si ya existe una instancia, reutilizarla
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY deben estar definidas en el archivo .env"
    );
  }

  // Crear la instancia única solo una vez
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

export default supabaseClient;
