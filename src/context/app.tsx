import React, { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { Product } from "../api/products";
import type { Category } from "../api/categories";
import { fetchProducts } from "../api/products";
import { fetchCategories } from "../api/categories";

export interface SellProduct {
  id: string;
  product: Product;
  quantity: number;
  note?: string;
  isNew?: boolean;
  addedQuantity?: number;
}

interface AppContextProps {
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  loadProducts: () => Promise<void>;
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  loadCategories: () => Promise<void>;
  sellProducts: SellProduct[];
  addSellProduct: (product: Product) => void;
  updateSellProductQuantity: (id: string, quantity: number) => void;
  updateSellProductNote: (id: string, note: string) => void;
  removeSellProduct: (id: string) => void;
  clearSellProducts: () => void;
}

const initialState: AppContextProps = {
  products: [],
  productsLoading: false,
  productsError: null,
  loadProducts: async () => {},
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  loadCategories: async () => {},
  sellProducts: [],
  addSellProduct: () => {},
  updateSellProductQuantity: () => {},
  updateSellProductNote: () => {},
  removeSellProduct: () => {},
  clearSellProducts: () => {},
};

export const AppContext = createContext<AppContextProps>(initialState);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [sellProducts, setSellProducts] = useState<SellProduct[]>([]);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);

    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (err) {
      setProductsError(
        err instanceof Error ? err.message : "Error al cargar productos"
      );
      console.error("Error loading products:", err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);

    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    } catch (err) {
      setCategoriesError(
        err instanceof Error ? err.message : "Error al cargar categorías"
      );
      console.error("Error loading categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const addSellProduct = useCallback((product: Product) => {
    setSellProducts((prev) => {
      const existingIndex = prev.findIndex(
        (sp) => sp.product.name === product.name
      );

      if (existingIndex >= 0) {
        // Si ya existe, incrementar cantidad y acumular addedQuantity
        const updated = [...prev];
        const currentItem = updated[existingIndex];
        updated[existingIndex] = {
          ...currentItem,
          quantity: currentItem.quantity + 1,
          isNew: true,
          addedQuantity: (currentItem.addedQuantity || 0) + 1,
        };
        return updated;
      } else {
        // Si no existe, agregar nuevo
        const newSellProduct: SellProduct = {
          id: `${product.name}-${Date.now()}`,
          product,
          quantity: 1,
          isNew: true,
          addedQuantity: 1,
        };
        return [...prev, newSellProduct];
      }
    });
  }, []);

  const removeSellProduct = useCallback((id: string) => {
    setSellProducts((prev) => prev.filter((sp) => sp.id !== id));
  }, []);

  const updateSellProductQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeSellProduct(id);
      return;
    }
    setSellProducts((prev) =>
      prev.map((sp) => {
        if (sp.id === id) {
          const previousQuantity = sp.quantity;
          const difference = quantity - previousQuantity;
          return {
            ...sp,
            quantity,
            addedQuantity: Math.max(0, (sp.addedQuantity || 0) + difference),
          };
        }
        return sp;
      })
    );
  }, [removeSellProduct]);

  const updateSellProductNote = useCallback((id: string, note: string) => {
    setSellProducts((prev) =>
      prev.map((sp) => (sp.id === id ? { ...sp, note } : sp))
    );
  }, []);

  const clearSellProducts = useCallback(() => {
    setSellProducts([]);
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  return (
    <AppContext.Provider
      value={{
        products,
        productsLoading,
        productsError,
        loadProducts,
        categories,
        categoriesLoading,
        categoriesError,
        loadCategories,
        sellProducts,
        addSellProduct,
        updateSellProductQuantity,
        updateSellProductNote,
        removeSellProduct,
        clearSellProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
