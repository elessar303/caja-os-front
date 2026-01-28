import supabaseClient from "../db/connect";
import type { User } from "./users";

/**
 * Autentica un usuario verificando username y password
 * @param businessId - UUID del business al que pertenece el usuario
 * @param username - Nombre de usuario
 * @param password - Contraseña en texto plano
 * @returns Promise con el usuario autenticado o null si las credenciales son inválidas
 *
 * NOTA: La verificación de contraseña debería hacerse en el backend usando bcrypt.
 * Por ahora, se hace una comparación simple. Esto debe ser reemplazado por una
 * función de backend que use bcrypt para comparar el hash.
 */
export const authenticateUser = async (
  businessId: string,
  username: string,
  password: string
): Promise<User | null> => {
  try {
    const supabase = supabaseClient();

    // Buscar usuario por username y business_id
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("business_id", businessId)
      .eq("username", username)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No se encontró ningún usuario
        return null;
      }
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const user = data as User;
    if (password.trim() !== user.password_hash.trim()) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
};
