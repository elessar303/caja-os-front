import { useContext } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { ThemeContext } from "../../context/theme";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  ConfirmButton,
  CancelButton,
  ConfirmMessage,
  ButtonContent,
} from "./SaleConfirmModalStyled";

interface SaleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paymentMethodName: string;
  total: number;
  itemsCount: number;
}

export default function SaleConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  paymentMethodName,
  total,
  itemsCount,
}: SaleConfirmModalProps) {
  const { darkMode } = useContext(ThemeContext);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer $darkMode={darkMode}>
        <ModalHeader>
          <ModalTitle>Confirmar Venta</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ConfirmMessage>
            ¿Desea completar la venta con <strong>{paymentMethodName}</strong>?
          </ConfirmMessage>
          <ConfirmMessage>
            <strong>{itemsCount}</strong> artículo{itemsCount !== 1 ? "s" : ""} -{" "}
            <strong>Total: ${total.toFixed(2)}</strong>
          </ConfirmMessage>
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={onClose}>
            <ButtonContent>
              <FaTimes color="#ef4444" />
              <span>No</span>
            </ButtonContent>
          </CancelButton>
          <ConfirmButton onClick={onConfirm}>
            <ButtonContent>
              <FaCheck color="#22c55e" />
              <span>Sí</span>
            </ButtonContent>
          </ConfirmButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
}
