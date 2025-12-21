import type { Product } from "../../api/products";

/**
 * Calcula si un producto tiene stock bajo
 * Stock bajo cuando está entre 1 y 5 valores por encima del min stock
 * Ejemplo: si min_stock es 5, stock bajo cuando current_stock está entre 6 y 10
 * @param product - Producto a evaluar
 * @returns true si el producto tiene stock bajo, false en caso contrario
 */
export const isStockLow = (product: Product): boolean => {
  const currentStock = parseFloat(product.current_stock) || 0;
  const minStock = parseFloat(product.min_stock) || 0;
  const difference = currentStock - minStock;
  return difference >= 1 && difference <= 5 && currentStock > 0;
};

