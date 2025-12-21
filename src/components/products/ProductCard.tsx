import { useContext } from "react";
import { Card, Img, Barcode, Name, Price } from "./styled";
import { AppContext } from "../../context/app";
import type { Product } from "../../api/products";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addSellProduct } = useContext(AppContext);

  const handleClick = () => {
    addSellProduct(product);
  };

  return (
    <Card onClick={handleClick}>
      <Img />
      <Barcode>{product.barcode}</Barcode>
      <Name>{product.name}</Name>
      <Price>{product.price}</Price>
    </Card>
  );
}
