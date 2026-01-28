import { FaTimes, FaCheck } from "react-icons/fa";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ConfirmMessage,
  ButtonGroup,
  CancelButton,
  ConfirmButton,
} from "./DeleteConfirmModalStyled";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: "product" | "category" | "user" | "paymentMethod";
  barcode?: string | null;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
  barcode,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {itemType === "product"
              ? "Eliminar Producto"
              : itemType === "category"
              ? "Eliminar Categoría"
              : itemType === "user"
              ? "Eliminar Usuario"
              : "Eliminar Método de Pago"}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ConfirmMessage>
            ¿Desea borrar{" "}
            {itemType === "product"
              ? "el producto"
              : itemType === "category"
              ? "la categoría"
              : itemType === "user"
              ? "el usuario"
              : "el método de pago"}{" "}
            <strong>{itemName}</strong>
            {itemType === "product" && barcode && (
              <>
                {" "}
                con código de barras <strong>{barcode}</strong>
              </>
            )}
            ?
          </ConfirmMessage>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              <FaTimes />
              No
            </CancelButton>
            <ConfirmButton type="button" onClick={handleConfirm}>
              <FaCheck />
              Sí
            </ConfirmButton>
          </ButtonGroup>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
}

