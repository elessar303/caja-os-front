import { FaTimes, FaWhatsapp, FaExclamationTriangle } from "react-icons/fa";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitleContainer,
  ModalTitle,
  ModalSubtitle,
  AlertIcon,
  CloseButton,
  ModalBody,
  ModalMessage,
  ButtonGroup,
  RenewButton,
} from "./LicenseExpiredModalStyled";

interface LicenseExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

export default function LicenseExpiredModal({
  isOpen,
  onClose,
  whatsappNumber, // Número por defecto, debe ser configurado
}: LicenseExpiredModalProps) {
  if (!isOpen) return null;

  // Formatear el número de WhatsApp (eliminar caracteres no numéricos)
  const formattedNumber = whatsappNumber.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=Hola,%20necesito%20renovar%20mi%20licencia%20de%20CajaOS`;

  return (
    <ModalOverlay>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitleContainer>
            <AlertIcon>
              <FaExclamationTriangle />
            </AlertIcon>
            <div>
              <ModalTitle>Licencia Expirada</ModalTitle>
              <ModalSubtitle>Tu licencia de CajaOS ha expirado.</ModalSubtitle>
            </div>
          </ModalTitleContainer>
          <CloseButton onClick={onClose} type="button">
            <FaTimes style={{ color: "inherit !important", flexShrink: 0 }} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ModalMessage>
            Debes renovarla para poder continuar utilizando el sistema.
          </ModalMessage>

          <ButtonGroup>
            <RenewButton
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
              Renovar Ahora
            </RenewButton>
          </ButtonGroup>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
}
