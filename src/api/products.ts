export interface Product {
  id: string;
  business_id: string;
  category_id: string;
  name: string;
  barcode: string;
  price: string;
  cost: string;
  image_url: string;
  is_weighable: boolean;
  is_editable_price: boolean;
  tax_included: boolean;
  current_stock: string;
  min_stock: string;
  created_at: string;
  updated_at: string;
}

/**
 * Simula una llamada a la API para obtener productos de un business específico
 * @param businessId - UUID del business
 * @returns Promise con el array de productos filtrados por business_id
 */
export const fetchProducts = async (businessId: string): Promise<Product[]> => {
  // Simular llamada a API con delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Importar productos del mock
  const productsData = await import("../mocks/products.json");
  const allProducts = productsData.default || productsData;
  
  // Filtrar productos por business_id
  return allProducts.filter((product) => product.business_id === businessId);
};

