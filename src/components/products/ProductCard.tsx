import { useContext } from "react";
import { Card, Img, ImagePlaceholder, Barcode, Name, Price } from "./styled";
import { AppContext } from "../../context/app";
import type { Product } from "../../api/products";
import { getProductImageUrl } from "../../utils/productSearch";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addSellProduct } = useContext(AppContext);

  const handleClick = () => {
    addSellProduct(product);
  };

  const imageUrl = getProductImageUrl(product.image_url);

  return (
    <Card onClick={handleClick}>
      {imageUrl ? (
        <Img src={imageUrl} alt={product.name} />
      ) : (
        <ImagePlaceholder />
      )}
      {product.barcode && <Barcode>{product.barcode}</Barcode>}
      <Name>{product.name}</Name>
      <Price>${product.price.toFixed(2)}</Price>
    </Card>
  );
}
