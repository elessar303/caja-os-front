import React, { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { Product } from "../api/products";
import type { Category } from "../api/categories";
import type { User } from "../api/users";
import type { Business } from "../api/businesses";
import type { PaymentMethod } from "../api/paymentMethods";
import { fetchProducts } from "../api/products";
import { fetchCategories } from "../api/categories";
import { fetchUsers } from "../api/users";
import { fetchPaymentMethods } from "../api/paymentMethods";
import { fetchBusinessById } from "../api/businesses";
import {
  saveToSessionStorage,
  getFromSessionStorage,
  removeFromSessionStorage,
} from "../config/storage";

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
  users: User[];
  usersLoading: boolean;
  usersError: string | null;
  loadUsers: () => Promise<void>;
  paymentMethods: PaymentMethod[];
  paymentMethodsLoading: boolean;
  paymentMethodsError: string | null;
  loadPaymentMethods: () => Promise<void>;
  currentUser: User | null;
  currentBusiness: Business | null;
  isAuthenticated: boolean;
  login: (user: User, business: Business) => void;
  logout: () => void;
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
  users: [],
  usersLoading: false,
  usersError: null,
  loadUsers: async () => {},
  paymentMethods: [],
  paymentMethodsLoading: false,
  paymentMethodsError: null,
  loadPaymentMethods: async () => {},
  currentUser: null,
  currentBusiness: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
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

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState<boolean>(false);
  const [paymentMethodsError, setPaymentMethodsError] = useState<string | null>(null);

  // Usuario logueado - se carga desde sessionStorage si existe (con codificación opcional)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return getFromSessionStorage<User>("currentUser");
  });

  // Business del usuario - se carga desde sessionStorage si existe (con codificación opcional)
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(
    () => {
      return getFromSessionStorage<Business>("currentBusiness");
    }
  );

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!getFromSessionStorage<User>("currentUser");
  });

  const login = useCallback(async (user: User, business: Business) => {
    setCurrentUser(user);
    setCurrentBusiness(business);
    setIsAuthenticated(true);
    // Guardar en sessionStorage con codificación opcional
    saveToSessionStorage("currentUser", user);
    saveToSessionStorage("currentBusiness", business);
    
    // Cargar métodos de pago al hacer login
    if (business.id) {
      try {
        setPaymentMethodsLoading(true);
        setPaymentMethodsError(null);
        const paymentMethodsData = await fetchPaymentMethods(business.id);
        setPaymentMethods(paymentMethodsData);
      } catch (err) {
        setPaymentMethodsError(
          err instanceof Error ? err.message : "Error al cargar métodos de pago"
        );
        console.error("Error loading payment methods:", err);
      } finally {
        setPaymentMethodsLoading(false);
      }
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCurrentBusiness(null);
    setIsAuthenticated(false);
    setPaymentMethods([]);
    // Limpiar sessionStorage
    removeFromSessionStorage("currentUser");
    removeFromSessionStorage("currentBusiness");
    // Limpiar localStorage también para forzar nuevo login
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberedBusiness");
  }, []);

  const [sellProducts, setSellProducts] = useState<SellProduct[]>([]);

  const loadProducts = useCallback(async () => {
    if (!currentUser?.business_id) {
      setProductsError("No hay usuario logueado");
      return;
    }

    setProductsLoading(true);
    setProductsError(null);

    try {
      const productsData = await fetchProducts(currentUser.business_id);
      setProducts(productsData);
    } catch (err) {
      setProductsError(
        err instanceof Error ? err.message : "Error al cargar productos"
      );
      console.error("Error loading products:", err);
    } finally {
      setProductsLoading(false);
    }
  }, [currentUser]);

  const loadCategories = useCallback(async () => {
    if (!currentUser?.business_id) {
      setCategoriesError("No hay usuario logueado");
      return;
    }

    setCategoriesLoading(true);
    setCategoriesError(null);

    try {
      const categoriesData = await fetchCategories(currentUser.business_id);
      setCategories(categoriesData);
    } catch (err) {
      setCategoriesError(
        err instanceof Error ? err.message : "Error al cargar categorías"
      );
      console.error("Error loading categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  }, [currentUser]);

  const loadUsers = useCallback(async () => {
    if (!currentUser?.business_id) {
      setUsersError("No hay usuario logueado");
      return;
    }

    setUsersLoading(true);
    setUsersError(null);

    try {
      const usersData = await fetchUsers(currentUser.business_id);
      setUsers(usersData);
    } catch (err) {
      setUsersError(
        err instanceof Error ? err.message : "Error al cargar usuarios"
      );
      console.error("Error loading users:", err);
    } finally {
      setUsersLoading(false);
    }
  }, [currentUser]);

  const loadPaymentMethods = useCallback(async () => {
    if (!currentUser?.business_id) {
      setPaymentMethodsError("No hay usuario logueado");
      return;
    }

    setPaymentMethodsLoading(true);
    setPaymentMethodsError(null);

    try {
      const paymentMethodsData = await fetchPaymentMethods(currentUser.business_id);
      setPaymentMethods(paymentMethodsData);
    } catch (err) {
      setPaymentMethodsError(
        err instanceof Error ? err.message : "Error al cargar métodos de pago"
      );
      console.error("Error loading payment methods:", err);
    } finally {
      setPaymentMethodsLoading(false);
    }
  }, [currentUser]);

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

  const updateSellProductQuantity = useCallback(
    (id: string, quantity: number) => {
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
    },
    [removeSellProduct]
  );

  const updateSellProductNote = useCallback((id: string, note: string) => {
    setSellProducts((prev) =>
      prev.map((sp) => (sp.id === id ? { ...sp, note } : sp))
    );
  }, []);

  const clearSellProducts = useCallback(() => {
    setSellProducts([]);
  }, []);

  // Cargar business si existe usuario pero no business (migración de sesiones antiguas)
  useEffect(() => {
    const loadBusinessIfNeeded = async () => {
      if (currentUser?.business_id && !currentBusiness) {
        try {
          const business = await fetchBusinessById(currentUser.business_id);
          if (business) {
            setCurrentBusiness(business);
            saveToSessionStorage("currentBusiness", business);
          }
        } catch (error) {
          console.error("Error loading business:", error);
        }
      }
    };

    loadBusinessIfNeeded();
  }, [currentUser, currentBusiness]);

  // Solo cargar datos si hay un usuario autenticado
  useEffect(() => {
    if (currentUser?.business_id) {
      loadProducts();
      loadCategories();
      loadUsers();
      loadPaymentMethods();
    }
  }, [currentUser, loadProducts, loadCategories, loadUsers, loadPaymentMethods]);

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
        users,
        usersLoading,
        usersError,
        loadUsers,
        paymentMethods,
        paymentMethodsLoading,
        paymentMethodsError,
        loadPaymentMethods,
        currentUser,
        currentBusiness,
        isAuthenticated,
        login,
        logout,
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
