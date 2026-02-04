import { useState, useEffect, useMemo } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import type { PaymentMethod } from "../../../api/paymentMethods";
import { getPaymentMethodIcon } from "../../../utils/iconMapper";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalSubtitle,
  CloseButton,
  ModalBody,
  FormRow,
  FormGroup,
  Label,
  Input,
  Select,
  IconSelector,
  IconOption,
  IconPreview,
  ColorSelector,
  ColorOption,
  ColorCircle,
  ButtonGroup,
  CancelButton,
  SaveButton,
} from "./PaymentMethodModalStyled";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentMethod: Partial<PaymentMethod>) => void;
  paymentMethod?: PaymentMethod | null;
}

// Mapeo de nombres amigables a nombres técnicos de iconos
const iconOptions = [
  { label: "Banco", value: "University" },
  { label: "Tarjeta", value: "CreditCard" },
  { label: "Transferencia", value: "ExchangeAlt" },
  { label: "QR", value: "QrCode" },
  { label: "Dolar", value: "DollarSign" },
  { label: "Billetera", value: "Wallet" },
  { label: "Celular", value: "Mobile" },
  { label: "Monedas", value: "Coins" },
  { label: "Moneda", value: "MoneyBill" },
];

// Colores disponibles
const colorOptions = [
  { value: "#10b981", label: "Verde" },
  { value: "#3b82f6", label: "Azul" },
  { value: "#8b5cf6", label: "Morado" },
  { value: "#f59e0b", label: "Naranja" },
  { value: "#ef4444", label: "Rojo" },
  { value: "#ec4899", label: "Rosa" },
  { value: "#06b6d4", label: "Cian" },
  { value: "#84cc16", label: "Lima" },
];

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onSave,
  paymentMethod,
}: PaymentMethodModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [icon, setIcon] = useState("DollarSign");
  const [color, setColor] = useState("#10b981");

  // Validar formulario - nombre y código son obligatorios
  const isFormValid = useMemo(() => {
    return name.trim().length > 0 && code.trim().length > 0;
  }, [name, code]);

  // Cargar datos del método de pago si está en modo edición
  useEffect(() => {
    if (paymentMethod && isOpen) {
      setName(paymentMethod.name || "");
      setCode(paymentMethod.code || "");
      setIcon(paymentMethod.icon || "DollarSign");
      setColor(paymentMethod.color || "#10b981");
    } else if (isOpen) {
      // Resetear formulario para nuevo método de pago
      setName("");
      setCode("");
      setIcon("DollarSign");
      setColor("#10b981");
    }
  }, [paymentMethod, isOpen]);

  const handleSave = () => {
    if (!isFormValid) {
      return;
    }

    const paymentMethodData: Partial<PaymentMethod> = {
      name: name.trim(),
      code: code.trim().toLowerCase(),
      icon: icon,
      color: color,
      is_active: true,
      is_system: false,
      display_order: 0,
    };

    if (paymentMethod) {
      paymentMethodData.id = paymentMethod.id;
      paymentMethodData.business_id = paymentMethod.business_id;
    }

    onSave(paymentMethodData);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <ModalTitle>
              {paymentMethod
                ? "Editar Método de Pago"
                : "Agregar Método de Pago"}
            </ModalTitle>
            <ModalSubtitle>
              Complete los datos. Los campos marcados con{" "}
              <span style={{ color: "#ef4444" }}>*</span> son obligatorios
            </ModalSubtitle>
          </div>
          <CloseButton onClick={onClose} type="button">
            <FaTimes style={{ color: "inherit !important", flexShrink: 0 }} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Primera línea: Nombre y Código */}
          <FormRow>
            <FormGroup>
              <Label>
                Nombre <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del método de pago"
              />
            </FormGroup>
            <FormGroup>
              <Label>
                Código <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Código único"
              />
            </FormGroup>
          </FormRow>

          {/* Segunda línea: Selector de Icono */}
          <FormRow>
            <FormGroup style={{ flex: 1 }}>
              <Label>
                Icono <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <IconSelector>
                {iconOptions.map((option) => (
                  <IconOption
                    key={option.value}
                    $isSelected={icon === option.value}
                    onClick={() => setIcon(option.value)}
                    type="button"
                  >
                    <IconPreview $color={color}>
                      {getPaymentMethodIcon(option.value)}
                    </IconPreview>
                    <span>{option.label}</span>
                  </IconOption>
                ))}
              </IconSelector>
            </FormGroup>
          </FormRow>

          {/* Tercera línea: Selector de Color */}
          <FormRow>
            <FormGroup style={{ flex: 1 }}>
              <Label>
                Color <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <ColorSelector>
                {colorOptions.map((option) => (
                  <ColorOption
                    key={option.value}
                    $isSelected={color === option.value}
                    onClick={() => setColor(option.value)}
                    type="button"
                    title={option.label}
                  >
                    <ColorCircle $color={option.value} />
                  </ColorOption>
                ))}
              </ColorSelector>
            </FormGroup>
          </FormRow>
        </ModalBody>

        <ButtonGroup>
          <CancelButton type="button" onClick={onClose}>
            Cancelar
          </CancelButton>
          <SaveButton
            type="button"
            onClick={handleSave}
            disabled={!isFormValid}
          >
            <FaSave />
            Guardar
          </SaveButton>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
}
