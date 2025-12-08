import { useContext } from "react";
import { Card, Img, Barcode, Name, Price } from "./styled";
import { AppContext } from "../../context/app";
import type { Product } from "../../api/products";

interface Props {
  name: string;
  price: string;
  barcode: string;
}

export default function ProductCard({ name, price, barcode }: Props) {
  const { addSellProduct } = useContext(AppContext);

  const handleClick = () => {
    const product: Product = { name, price, barcode };
    addSellProduct(product);
  };

  return (
    <Card onClick={handleClick}>
      <Img />
      <Barcode>{barcode}</Barcode>
      <Name>{name}</Name>
      <Price>{price}</Price>
    </Card>
  );
}
