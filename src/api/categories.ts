export interface Category {
  id: string;
  business_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

/**
 * Simula una llamada a la API para obtener categorías de un business específico
 * @param businessId - UUID del business
 * @returns Promise con el array de categorías filtradas por business_id
 */
export const fetchCategories = async (businessId: string): Promise<Category[]> => {
  // Simular llamada a API con delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Importar categorías del mock
  const categoriesData = await import("../mocks/categories.json");
  const allCategories = categoriesData.default || categoriesData;
  
  // Filtrar categorías por business_id
  return allCategories.filter((category) => category.business_id === businessId);
};
