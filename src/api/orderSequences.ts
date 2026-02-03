import supabaseClient from "../db/connect";

export interface OrderSequence {
  id: string;
  business_id: string;
  current_number: number;
  prefix: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Obtiene el número de orden actual para un business
 * @param businessId - UUID del business
 * @returns Promise con el número de orden actual o null si no existe
 */
export const getOrderSequence = async (
  businessId: string
): Promise<OrderSequence | null> => {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("order_sequences")
      .select("*")
      .eq("business_id", businessId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No se encontró el registro
        return null;
      }
      throw new Error(`Error al obtener secuencia de orden: ${error.message}`);
    }

    return data as OrderSequence;
  } catch (error) {
    console.error("Error fetching order sequence:", error);
    throw error;
  }
};

/**
 * Obtiene el siguiente número de orden e incrementa el contador
 * @param businessId - UUID del business
 * @returns Promise con el nuevo número de orden formateado
 */
export const getNextOrderNumber = async (
  businessId: string
): Promise<string> => {
  try {
    const supabase = supabaseClient();

    // Obtener la secuencia actual
    const { data: sequence, error: fetchError } = await supabase
      .from("order_sequences")
      .select("*")
      .eq("business_id", businessId)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        throw new Error(
          "No se encontró el correlativo de órdenes para este negocio. Contacte al administrador."
        );
      }
      throw new Error(
        `Error al obtener secuencia de orden: ${fetchError.message}`
      );
    }

    if (!sequence) {
      throw new Error(
        "No se encontró el correlativo de órdenes para este negocio. Contacte al administrador."
      );
    }

    const nextNumber = (sequence.current_number || 0) + 1;
    const prefix = sequence.prefix || "";
    const orderNumber = `${prefix}${nextNumber.toString().padStart(6, "0")}`;

    return orderNumber;
  } catch (error) {
    console.error("Error getting next order number:", error);
    throw error;
  }
};

/**
 * Incrementa el contador de secuencia de órdenes
 * @param businessId - UUID del business
 * @returns Promise<void>
 */
export const incrementOrderSequence = async (
  businessId: string
): Promise<void> => {
  try {
    const supabase = supabaseClient();

    // Obtener el número actual
    const { data: sequence, error: fetchError } = await supabase
      .from("order_sequences")
      .select("current_number")
      .eq("business_id", businessId)
      .single();

    if (fetchError || !sequence) {
      throw new Error("Error al obtener secuencia actual");
    }

    // Incrementar el número
    const { error: updateError } = await supabase
      .from("order_sequences")
      .update({
        current_number: sequence.current_number + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("business_id", businessId);

    if (updateError) {
      throw new Error(
        `Error al actualizar secuencia de orden: ${updateError.message}`
      );
    }
  } catch (error) {
    console.error("Error incrementing order sequence:", error);
    throw error;
  }
};
