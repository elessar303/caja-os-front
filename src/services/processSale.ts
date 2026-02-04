import {
  createSale,
  buildSaleItems,
  DEFAULT_SALE_META,
  type PaymentDetails,
} from "../api/sales";
import {
  getNextOrderNumber,
  incrementOrderSequence,
} from "../api/orderSequences";
import { updateProductsStock } from "../api/products";

export interface ProcessSaleParams {
  businessId: string;
  userId: string;
  sellProducts: Array<{
    product: { id: string; name: string; price: number };
    quantity: number;
    note?: string;
  }>;
  paymentDetails: PaymentDetails;
}

export interface ProcessSaleResult {
  orderNumber: string;
  total: number;
}

const SALE_ERROR_MESSAGE = "Error al procesar la venta. Intente nuevamente.";

/**
 * Ejecuta el flujo completo de una venta: orden, crear venta, secuencia, stock.
 * Usado tanto por cobro directo (header) como por modal Finalizar Venta.
 */
export async function processSale(
  params: ProcessSaleParams
): Promise<ProcessSaleResult> {
  const { businessId, userId, sellProducts, paymentDetails } = params;

  const orderNumber = await getNextOrderNumber(businessId);
  const saleItems = buildSaleItems(sellProducts);
  const subtotal = sellProducts.reduce(
    (sum, sp) => sum + sp.product.price * sp.quantity,
    0
  );
  const discount = 0;
  const total = subtotal - discount;
  const paymentMethodCode = paymentDetails.methods[0]?.code ?? "cash";

  await createSale({
    business_id: businessId,
    user_id: userId,
    ...DEFAULT_SALE_META,
    subtotal,
    discount,
    total,
    payment_method: paymentMethodCode,
    items: saleItems,
    order_number: orderNumber,
    payment_details: paymentDetails,
  });

  await incrementOrderSequence(businessId);

  const stockUpdates = sellProducts.map((sp) => ({
    productId: sp.product.id,
    quantity: sp.quantity,
  }));
  await updateProductsStock(stockUpdates, businessId);

  return { orderNumber, total };
}

/** Mensaje de error amigable para mostrar en snackbar al fallar una venta */
export function getSaleErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : SALE_ERROR_MESSAGE;
}
