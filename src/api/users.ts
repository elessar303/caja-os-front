export interface User {
  id: string;
  auth_id: string | null;
  business_id: string;
  username: string;
  password_hash: string;
  role: "admin" | "cashier" | "mozo";
  is_active: boolean;
  permissions: string;
  created_at: string;
  updated_at: string;
  email: string;
  full_name: string;
}

import supabaseClient from "../db/connect";

/**
 * Obtiene usuarios de un business específico desde Supabase
 * @param businessId - UUID del business
 * @returns Promise con el array de usuarios filtrados por business_id
 */
export const fetchUsers = async (businessId: string): Promise<User[]> => {
  try {
    const supabase = supabaseClient();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }

    return (data as User[]) || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Crea un nuevo usuario en Supabase
 * @param userData - Datos del usuario a crear
 * @returns Promise con el usuario creado
 */
export const createUser = async (
  userData: Omit<User, "id" | "created_at" | "updated_at" | "auth_id">
): Promise<User> => {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }

    return data as User;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Actualiza un usuario existente en Supabase
 * @param userId - ID del usuario a actualizar
 * @param userData - Datos del usuario a actualizar
 * @param businessId - ID del business al que pertenece el usuario
 * @returns Promise con el usuario actualizado
 */
export const updateUser = async (
  userId: string,
  userData: Partial<
    Omit<User, "id" | "business_id" | "created_at" | "auth_id">
  >,
  businessId: string
): Promise<User> => {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("users")
      .update({
        ...userData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .eq("business_id", businessId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }

    return data as User;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/**
 * Elimina un usuario de Supabase
 * @param userId - ID del usuario a eliminar
 * @param businessId - ID del business al que pertenece el usuario
 * @returns Promise<void>
 */
export const deleteUser = async (
  userId: string,
  businessId: string
): Promise<void> => {
  try {
    const supabase = supabaseClient();
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId)
      .eq("business_id", businessId);

    if (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
