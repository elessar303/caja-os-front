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

/**
 * Simula una llamada a la API para obtener usuarios de un business específico
 * @param businessId - UUID del business
 * @returns Promise con el array de usuarios filtrados por business_id
 */
export const fetchUsers = async (businessId: string): Promise<User[]> => {
  // Simular llamada a API con delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Importar usuarios del mock
  const usersData = await import("../mocks/users.json");
  const allUsers = usersData.default || usersData;

  // Filtrar usuarios por business_id
  return allUsers.filter((user) => user.business_id === businessId);
};


