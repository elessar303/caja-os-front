import type { Product } from "../api/products";

/**
 * Busca productos por nombre y código de barras
 * Maneja valores null/undefined de forma segura
 * @param product - Producto a buscar
 * @param searchTerm - Término de búsqueda
 * @returns true si el producto coincide con el término de búsqueda, false en caso contrario
 */
export const matchesProductSearch = (
  product: Product,
  searchTerm: string
): boolean => {
  if (!searchTerm || !searchTerm.trim()) {
    return true;
  }

  const searchLower = searchTerm.toLowerCase().trim();

  // Buscar en el nombre (siempre debe existir, pero manejamos null/undefined por seguridad)
  const nameMatch =
    product.name?.toLowerCase().includes(searchLower) ?? false;

  // Buscar en el código de barras (puede ser null o undefined)
  const barcodeMatch = product.barcode
    ? product.barcode.toLowerCase().includes(searchLower)
    : false;

  return nameMatch || barcodeMatch;
};

/**
 * Obtiene la URL de imagen del producto de forma segura
 * Si la URL está vacía o es null, retorna null (no string vacío)
 * @param imageUrl - URL de la imagen del producto
 * @returns URL de la imagen o null si está vacía
 */
export const getProductImageUrl = (
  imageUrl: string | null | undefined
): string | null => {
  if (!imageUrl || !imageUrl.trim()) {
    return null;
  }
  return imageUrl.trim();
};

/**
 * Filtra un array de productos por término de búsqueda
 * @param products - Array de productos a filtrar
 * @param searchTerm - Término de búsqueda
 * @returns Array de productos que coinciden con el término de búsqueda
 */
export const filterProductsBySearch = (
  products: Product[],
  searchTerm: string
): Product[] => {
  if (!searchTerm || !searchTerm.trim()) {
    return products;
  }

  return products.filter((product) => matchesProductSearch(product, searchTerm));
};
