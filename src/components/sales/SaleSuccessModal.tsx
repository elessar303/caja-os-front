import { useContext } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { ThemeContext } from "../../context/theme";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalSubtitle,
  SuccessIcon,
  ModalBody,
  DataBox,
  DataRow,
  DataLabel,
  DataValue,
  ModalFooter,
  CloseButton,
} from "./SaleSuccessModalStyled";

interface SaleSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  total: number;
}

export default function SaleSuccessModal({
  isOpen,
  onClose,
  orderNumber,
  total,
}: SaleSuccessModalProps) {
  const { darkMode } = useContext(ThemeContext);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer $darkMode={darkMode} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <SuccessIcon>
            <FaCheckCircle />
          </SuccessIcon>
          <ModalTitle>¡Venta Completada!</ModalTitle>
          <ModalSubtitle>
            La venta se ha registrado correctamente en el sistema.
          </ModalSubtitle>
        </ModalHeader>

        <ModalBody>
          <DataBox>
            <DataRow>
              <DataLabel>Número de Orden</DataLabel>
              <DataValue $highlight>{orderNumber}</DataValue>
            </DataRow>
            <DataRow>
              <DataLabel>Total</DataLabel>
              <DataValue $highlight>${total.toFixed(2)}</DataValue>
            </DataRow>
          </DataBox>
        </ModalBody>

        <ModalFooter>
          <CloseButton onClick={onClose}>Aceptar</CloseButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
}
