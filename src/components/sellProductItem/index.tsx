import { useContext, useState } from "react";
import { FaMinus, FaPlus, FaComment, FaCheck, FaTimes } from "react-icons/fa";
import {
  SellProductItemWrapper,
  ProductRow,
  ProductImageContainer,
  ProductImage,
  ProductInfo,
  ProductNameRow,
  ProductName,
  ProductDetails,
  ProductPrice,
  NewTag,
  AddNoteButton,
  NoteFooter,
  NoteInputContainer,
  NoteInput,
  NoteActionButton,
  NoteDisplay,
  QuantityControls,
  QuantityButton,
  QuantityValue,
  TotalPrice,
} from "./styled";
import type { SellProduct } from "../../context/app";
import { AppContext } from "../../context/app";

interface SellProductItemProps {
  sellProduct: SellProduct;
}

export default function SellProductItem({ sellProduct }: SellProductItemProps) {
  const { updateSellProductQuantity, updateSellProductNote } =
    useContext(AppContext);
  const { product, quantity, isNew, addedQuantity, note } = sellProduct;
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState(note || "");

  const price = parseFloat(product.price) || 0;
  const total = price * quantity;

  // Dividir el nombre del producto en partes (ej: "1 DOC + Gaseosa 1.5L")
  // Intentar separar por "+" primero
  const parts = product.name.split("+").map((p) => p.trim());
  const mainName = parts[0] || product.name;
  const detail = parts.slice(1).join(" ") || "";

  const handleDecrease = () => {
    updateSellProductQuantity(sellProduct.id, quantity - 1);
  };

  const handleIncrease = () => {
    updateSellProductQuantity(sellProduct.id, quantity + 1);
  };

  const handleAddNote = () => {
    setIsEditingNote(true);
    setNoteValue(note || "");
  };

  const handleSaveNote = () => {
    updateSellProductNote(sellProduct.id, noteValue);
    setIsEditingNote(false);
  };

  const handleCancelNote = () => {
    setNoteValue(note || "");
    setIsEditingNote(false);
  };

  return (
    <SellProductItemWrapper>
      <ProductRow>
        <ProductImageContainer>
          <ProductImage />
          {isNew && addedQuantity && <NewTag>+{addedQuantity} nuevo</NewTag>}
        </ProductImageContainer>
        <ProductInfo>
          <ProductNameRow>
            <ProductName>{mainName}</ProductName>
            <ProductPrice>{price.toFixed(2)}</ProductPrice>
          </ProductNameRow>
          {detail && <ProductDetails>{detail}</ProductDetails>}
        </ProductInfo>
        <QuantityControls>
          <QuantityButton onClick={handleDecrease}>
            <FaMinus />
          </QuantityButton>
          <QuantityValue>{quantity}</QuantityValue>
          <QuantityButton onClick={handleIncrease}>
            <FaPlus />
          </QuantityButton>
        </QuantityControls>
        <TotalPrice>{total.toFixed(2)}</TotalPrice>
      </ProductRow>
      <NoteFooter>
        <AddNoteButton onClick={handleAddNote}>
          <FaComment />
          <span>{note ? "Editar nota" : "Agregar nota"}</span>
        </AddNoteButton>
        {isEditingNote ? (
          <NoteInputContainer>
            <NoteInput
              type="text"
              value={noteValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNoteValue(e.target.value)
              }
              placeholder="Ej: sin tomate, sin cebolla..."
              autoFocus
            />
            <NoteActionButton onClick={handleSaveNote} color="green">
              <FaCheck />
            </NoteActionButton>
            <NoteActionButton onClick={handleCancelNote} color="red">
              <FaTimes />
            </NoteActionButton>
          </NoteInputContainer>
        ) : (
          note && (
            <NoteDisplay>
              <em>| {note}</em>
            </NoteDisplay>
          )
        )}
      </NoteFooter>
    </SellProductItemWrapper>
  );
}
