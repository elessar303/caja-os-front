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
  itemType: "product" | "category";
  barcode?: string;
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
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {itemType === "product" ? "Eliminar Producto" : "Eliminar Categoría"}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ConfirmMessage>
            ¿Desea borrar {itemType === "product" ? "el producto" : "la categoría"}{" "}
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

