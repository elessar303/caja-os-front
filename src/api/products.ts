export interface Product {
  id: string;
  business_id: string;
  category_id: string;
  name: string;
  barcode: string | null;
  price: number;
  cost: number;
  image_url: string | null;
  is_weighable: boolean;
  is_editable_price: boolean;
  tax_included: boolean;
  current_stock: number;
  min_stock: number;
  created_at: string;
  updated_at: string;
}

import supabaseClient from "../db/connect";

/**
 * Obtiene productos de un business específico desde Supabase
 * @param businessId - UUID del business
 * @returns Promise con el array de productos filtrados por business_id
 */
export const fetchProducts = async (businessId: string): Promise<Product[]> => {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("business_id", businessId)
      .order("name");

    if (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }

    return (data as Product[]) || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Crea un nuevo producto en Supabase
 * @param productData - Datos del producto a crear
 * @returns Promise con el producto creado
 */
export const createProduct = async (
  productData: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<Product> => {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }

    return data as Product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

/**
 * Actualiza un producto existente en Supabase
 * @param productId - ID del producto a actualizar
 * @param productData - Datos del producto a actualizar
 * @param businessId - ID del business al que pertenece el producto
 * @returns Promise con el producto actualizado
 */
export const updateProduct = async (
  productId: string,
  productData: Partial<Omit<Product, "id" | "business_id" | "created_at">>,
  businessId: string
): Promise<Product> => {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("products")
      .update({
        ...productData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .eq("business_id", businessId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }

    return data as Product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

/**
 * Elimina un producto de Supabase
 * @param productId - ID del producto a eliminar
 * @param businessId - ID del business al que pertenece el producto
 * @returns Promise<void>
 */
export const deleteProduct = async (
  productId: string,
  businessId: string
): Promise<void> => {
  try {
    const supabase = supabaseClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .eq("business_id", businessId);

    if (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

/**
 * Actualiza masivamente los precios de productos de una categoría
 * @param categoryId - ID de la categoría
 * @param businessId - ID del business
 * @param increaseType - Tipo de aumento: "fixed" (monto fijo) o "percentage" (porcentaje)
 * @param increaseValue - Valor del aumento (monto fijo o porcentaje)
 * @returns Promise con el número de productos actualizados
 */
/**
 * Actualiza el stock de múltiples productos (resta la cantidad vendida)
 * @param stockUpdates - Array de objetos con productId y quantity a restar
 * @param businessId - ID del business
 * @returns Promise<void>
 */
export const updateProductsStock = async (
  stockUpdates: { productId: string; quantity: number }[],
  businessId: string
): Promise<void> => {
  try {
    const supabase = supabaseClient();

    // Actualizar cada producto
    const updatePromises = stockUpdates.map(async ({ productId, quantity }) => {
      // Obtener el stock actual
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("current_stock")
        .eq("id", productId)
        .eq("business_id", businessId)
        .single();

      if (fetchError) {
        throw new Error(
          `Error al obtener stock del producto: ${fetchError.message}`
        );
      }

      const currentStock = product?.current_stock || 0;
      const newStock = Math.max(0, currentStock - quantity);

      // Actualizar el stock
      const { error: updateError } = await supabase
        .from("products")
        .update({
          current_stock: newStock,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId)
        .eq("business_id", businessId);

      if (updateError) {
        throw new Error(
          `Error al actualizar stock del producto: ${updateError.message}`
        );
      }
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error updating products stock:", error);
    throw error;
  }
};

export const bulkUpdateProductPrices = async (
  categoryId: string,
  businessId: string,
  increaseType: "fixed" | "percentage",
  increaseValue: number
): Promise<number> => {
  try {
    const supabase = supabaseClient();

    // Primero obtener todos los productos de la categoría
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("id, price")
      .eq("category_id", categoryId)
      .eq("business_id", businessId);

    if (fetchError) {
      throw new Error(`Error al obtener productos: ${fetchError.message}`);
    }

    if (!products || products.length === 0) {
      return 0;
    }

    // Calcular nuevos precios
    const updates = products.map((product) => {
      let newPrice: number;

      if (increaseType === "percentage") {
        // Aumento porcentual: precio * (1 + porcentaje/100)
        newPrice = product.price * (1 + increaseValue / 100);
      } else {
        // Aumento fijo: precio + monto
        newPrice = product.price + increaseValue;
      }

      // Redondear a 2 decimales y asegurar que no sea negativo
      newPrice = Math.max(0, Math.round(newPrice * 100) / 100);

      return {
        id: product.id,
        price: newPrice,
        updated_at: new Date().toISOString(),
      };
    });

    // Actualizar productos en lotes (Supabase permite hasta 50 items por batch)
    const batchSize = 50;
    let updatedCount = 0;

    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);

      // Usar RPC o múltiples updates
      // Por limitaciones de Supabase, haremos updates individuales
      // o podemos usar un stored procedure si está disponible
      const updatePromises = batch.map((update) =>
        supabase
          .from("products")
          .update({ price: update.price, updated_at: update.updated_at })
          .eq("id", update.id)
          .eq("business_id", businessId)
      );

      const results = await Promise.all(updatePromises);

      // Verificar errores
      const errors = results.filter((result) => result.error);
      if (errors.length > 0) {
        throw new Error(
          `Error al actualizar algunos productos: ${errors[0].error?.message}`
        );
      }

      updatedCount += batch.length;
    }

    return updatedCount;
  } catch (error) {
    console.error("Error bulk updating product prices:", error);
    throw error;
  }
};
