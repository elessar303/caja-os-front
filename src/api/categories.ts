export interface Category {
  id: string;
  business_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

import supabaseClient from "../db/connect";

/**
 * Obtiene categorías de un business específico desde Supabase
 * @param businessId - UUID del business
 * @returns Promise con el array de categorías filtradas por business_id
 */
export const fetchCategories = async (
  businessId: string
): Promise<Category[]> => {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("business_id", businessId)
      .order("name");
    if (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }

    return (data as Category[]) || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Crea una nueva categoría en Supabase
 * @param categoryData - Datos de la categoría a crear
 * @returns Promise con la categoría creada
 */
export const createCategory = async (
  categoryData: Omit<Category, "id" | "created_at" | "updated_at">
): Promise<Category> => {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear categoría: ${error.message}`);
    }

    return data as Category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

/**
 * Actualiza una categoría existente en Supabase
 * @param categoryId - ID de la categoría a actualizar
 * @param categoryData - Datos de la categoría a actualizar
 * @param businessId - ID del business al que pertenece la categoría
 * @returns Promise con la categoría actualizada
 */
export const updateCategory = async (
  categoryId: string,
  categoryData: Partial<Omit<Category, "id" | "business_id" | "created_at">>,
  businessId: string
): Promise<Category> => {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .update({
        ...categoryData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", categoryId)
      .eq("business_id", businessId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar categoría: ${error.message}`);
    }

    return data as Category;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

/**
 * Verifica si una categoría tiene productos asociados
 * @param categoryId - ID de la categoría a verificar
 * @param businessId - ID del business
 * @returns Promise con el número de productos asociados
 */
export const getCategoryProductsCount = async (
  categoryId: string,
  businessId: string
): Promise<number> => {
  try {
    const supabase = supabaseClient();
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", categoryId)
      .eq("business_id", businessId);

    if (error) {
      throw new Error(
        `Error al verificar productos de la categoría: ${error.message}`
      );
    }

    return count || 0;
  } catch (error) {
    console.error("Error getting category products count:", error);
    throw error;
  }
};

/**
 * Elimina una categoría de Supabase
 * @param categoryId - ID de la categoría a eliminar
 * @param businessId - ID del business al que pertenece la categoría
 * @returns Promise<void>
 */
export const deleteCategory = async (
  categoryId: string,
  businessId: string
): Promise<void> => {
  try {
    const supabase = supabaseClient();
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId)
      .eq("business_id", businessId);

    if (error) {
      throw new Error(`Error al eliminar categoría: ${error.message}`);
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
