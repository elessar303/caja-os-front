import supabaseClient from "../db/connect";

export interface Business {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  tax_id: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  license_start_date: string;
  license_end_date: string | null;
  tables_enabled: boolean;
  features: {
    restaurant: boolean;
  };
}

/**
 * Busca un negocio por su nombre
 * @param name - Nombre del negocio a buscar
 * @returns Promise con el negocio encontrado o null si no existe
 */
export const fetchBusinessByName = async (
  name: string
): Promise<Business | null> => {
  try {
    const supabase = supabaseClient();

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .ilike("name", name)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No se encontró ningún registro
        return null;
      }
      throw new Error(`Error al buscar negocio: ${error.message}`);
    }

    return (data as Business) || null;
  } catch (error) {
    console.error("Error fetching business by name:", error);
    throw error;
  }
};

/**
 * Obtiene un negocio por su ID
 * @param businessId - ID del negocio a buscar
 * @returns Promise con el negocio encontrado o null si no existe
 */
export const fetchBusinessById = async (
  businessId: string
): Promise<Business | null> => {
  try {
    const supabase = supabaseClient();

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No se encontró ningún registro
        return null;
      }
      throw new Error(`Error al buscar negocio: ${error.message}`);
    }

    return (data as Business) || null;
  } catch (error) {
    console.error("Error fetching business by id:", error);
    throw error;
  }
};
