export interface Category {
  id: string;
  description: string;
}

/**
 * Simula una llamada a la API para obtener categorías
 * @returns Promise con el array de categorías
 */
export const fetchCategories = async (): Promise<Category[]> => {
  // Simular llamada a API con delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Importar categorías del mock
  const categoriesData = await import("../mocks/categories.json");
  return categoriesData.default || categoriesData;
};
