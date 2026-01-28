import supabaseClient from "../db/connect";

export interface PaymentMethod {
  id: string;
  business_id: string;
  name: string;
  code: string;
  icon: string;
  color: string;
  is_active: boolean;
  is_system: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Obtiene métodos de pago de un business específico desde Supabase
 * @param businessId - UUID del business
 * @returns Promise con el array de métodos de pago filtrados por business_id, ordenados por display_order
 */
export const fetchPaymentMethods = async (
  businessId: string
): Promise<PaymentMethod[]> => {
  try {
    const supabase = supabaseClient();

    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("business_id", businessId)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Error al obtener métodos de pago: ${error.message}`);
    }

    return (data as PaymentMethod[]) || [];
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw error;
  }
};

/**
 * Crea un nuevo método de pago en Supabase
 * @param paymentMethodData - Datos del método de pago a crear
 * @returns Promise con el método de pago creado
 */
export const createPaymentMethod = async (
  paymentMethodData: Omit<PaymentMethod, "id" | "created_at" | "updated_at">
): Promise<PaymentMethod> => {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("payment_methods")
      .insert([paymentMethodData])
      .select()
      .single();

    if (error) {
      // Verificar si es un error de constraint único (código duplicado)
      if (
        error.code === "23505" ||
        error.message.includes("unique") ||
        error.message.includes("duplicate")
      ) {
        throw new Error(
          `Ya existe un método de pago con el código "${paymentMethodData.code}" para este negocio`
        );
      }
      throw new Error(`Error al crear método de pago: ${error.message}`);
    }

    return data as PaymentMethod;
  } catch (error) {
    console.error("Error creating payment method:", error);
    throw error;
  }
};

/**
 * Actualiza un método de pago existente en Supabase
 * @param paymentMethodId - ID del método de pago a actualizar
 * @param paymentMethodData - Datos del método de pago a actualizar
 * @param businessId - ID del business al que pertenece el método de pago
 * @returns Promise con el método de pago actualizado
 */
export const updatePaymentMethod = async (
  paymentMethodId: string,
  paymentMethodData: Partial<
    Omit<PaymentMethod, "id" | "business_id" | "created_at">
  >,
  businessId: string
): Promise<PaymentMethod> => {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("payment_methods")
      .update({
        ...paymentMethodData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentMethodId)
      .eq("business_id", businessId)
      .select()
      .single();

    if (error) {
      // Verificar si es un error de constraint único (código duplicado)
      if (
        error.code === "23505" ||
        error.message.includes("unique") ||
        error.message.includes("duplicate")
      ) {
        throw new Error(
          `Ya existe un método de pago con el código "${paymentMethodData.code}" para este negocio`
        );
      }
      throw new Error(`Error al actualizar método de pago: ${error.message}`);
    }

    return data as PaymentMethod;
  } catch (error) {
    console.error("Error updating payment method:", error);
    throw error;
  }
};

/**
 * Elimina un método de pago de Supabase
 * @param paymentMethodId - ID del método de pago a eliminar
 * @param businessId - ID del business al que pertenece el método de pago
 * @returns Promise<void>
 */
export const deletePaymentMethod = async (
  paymentMethodId: string,
  businessId: string
): Promise<void> => {
  try {
    const supabase = supabaseClient();
    const { error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("id", paymentMethodId)
      .eq("business_id", businessId);

    if (error) {
      throw new Error(`Error al eliminar método de pago: ${error.message}`);
    }
  } catch (error) {
    console.error("Error deleting payment method:", error);
    throw error;
  }
};
