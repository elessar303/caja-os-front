import supabaseClient from "../db/connect";

export interface SaleItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
  notes?: string;
}

/** Método de pago dentro de payment_details */
export interface PaymentMethodDetail {
  code: string;
  amount: number;
}

/** Estructura de payment_details: un método (cobro directo) o varios (split) */
export interface PaymentDetails {
  split: boolean;
  methods: PaymentMethodDetail[];
}

export interface Sale {
  id: string;
  business_id: string;
  user_id: string | null;
  table_id: string | null;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: string;
  status: "pending" | "in_preparation" | "ready" | "completed" | "cancelled";
  items: SaleItem[];
  created_at: string;
  updated_at: string;
  order_type: string;
  customer_name: string | null;
  customer_address: string | null;
  customer_phone: string | null;
  is_locked: boolean;
  kitchen_printed: boolean;
  created_from: string;
  order_number: string;
  payment_details: PaymentDetails | null;
}

export interface CreateSaleData {
  business_id: string;
  user_id: string | null;
  table_id: string | null;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: string;
  status: string;
  items: SaleItem[];
  order_type: string;
  customer_name: string | null;
  customer_address: string | null;
  customer_phone: string | null;
  is_locked: boolean;
  kitchen_printed: boolean;
  created_from: string;
  order_number: string;
  /** Detalle de pagos: para cobro directo (split: false) o múltiple (split: true) */
  payment_details: PaymentDetails;
}

/**
 * Crea una nueva venta en Supabase
 * @param saleData - Datos de la venta a crear
 * @returns Promise con la venta creada
 */
export const createSale = async (saleData: CreateSaleData): Promise<Sale> => {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("sales")
      .insert([saleData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear venta: ${error.message}`);
    }

    return data as Sale;
  } catch (error) {
    console.error("Error creating sale:", error);
    throw error;
  }
};

/**
 * Obtiene las ventas de un business específico
 * @param businessId - UUID del business
 * @returns Promise con el array de ventas
 */
export const fetchSales = async (businessId: string): Promise<Sale[]> => {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error al obtener ventas: ${error.message}`);
    }

    return (data as Sale[]) || [];
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }
};
