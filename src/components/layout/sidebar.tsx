import { useContext } from "react";
import {
  SidebarWrapper,
  Empty,
  Bottom,
  TotalRow,
  Cancel,
  SellProductsList,
} from "./styled";
import { AppContext } from "../../context/app";
import SellProductItem from "../sellProductItem";

export default function Sidebar() {
  const { sellProducts, clearSellProducts } = useContext(AppContext);

  const calculateTotal = () => {
    return sellProducts.reduce((total, sp) => {
      const price = sp.product.price || 0;
      return total + price * sp.quantity;
    }, 0);
  };

  const total = calculateTotal();
  const hasProducts = sellProducts.length > 0;

  const handleCancelOrder = () => {
    if (hasProducts) {
      clearSellProducts();
    }
  };

  return (
    <SidebarWrapper>
      {!hasProducts ? (
        <Empty>No hay artículos</Empty>
      ) : (
        <SellProductsList>
          {sellProducts.map((sellProduct) => (
            <SellProductItem key={sellProduct.id} sellProduct={sellProduct} />
          ))}
        </SellProductsList>
      )}

      <Bottom>
        <TotalRow>
          <span>Total</span>
          <span>{total.toFixed(2)}</span>
        </TotalRow>
        <Cancel onClick={handleCancelOrder} disabled={!hasProducts}>
          Anular orden
        </Cancel>
      </Bottom>
    </SidebarWrapper>
  );
}
