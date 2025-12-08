export interface Product {
  name: string;
  price: string;
  barcode: string;
}

/**
 * Simula una llamada a la API para obtener productos
 * @returns Promise con el array de productos
 */
export const fetchProducts = async (): Promise<Product[]> => {
  // Simular llamada a API con delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Importar productos del mock
  const productsData = await import("../mocks/products.json");
  return productsData.default || productsData;
};

