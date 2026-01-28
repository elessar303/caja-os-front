import { useState, useEffect, useMemo } from "react";
import { FaTimes } from "react-icons/fa";
import type { Category } from "../../../api/categories";
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
  ButtonGroup,
  CancelButton,
  SaveButton,
} from "./ProductModalStyled";

interface BulkPriceUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (categoryId: string, increaseType: "fixed" | "percentage", increaseValue: number) => void;
  categories: Category[];
}

export default function BulkPriceUpdateModal({
  isOpen,
  onClose,
  onConfirm,
  categories,
}: BulkPriceUpdateModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [increaseType, setIncreaseType] = useState<"fixed" | "percentage">("percentage");
  const [increaseValue, setIncreaseValue] = useState<string>("");

  // Validar formulario
  const isFormValid = useMemo(() => {
    return (
      selectedCategoryId.trim() !== "" &&
      increaseValue.trim() !== "" &&
      !isNaN(parseFloat(increaseValue)) &&
      parseFloat(increaseValue) > 0
    );
  }, [selectedCategoryId, increaseValue]);

  // Resetear formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setSelectedCategoryId("");
      setIncreaseType("percentage");
      setIncreaseValue("");
    }
  }, [isOpen]);

  const handleValueChange = (value: string) => {
    // Validar según el tipo de aumento
    if (increaseType === "percentage") {
      // Solo números enteros para porcentaje
      const numValue = value.replace(/[^0-9]/g, "");
      setIncreaseValue(numValue);
    } else {
      // Números con 2 decimales para monto fijo
      const numValue = value.replace(/[^0-9.]/g, "");
      const parts = numValue.split(".");
      if (parts.length > 2) {
        // Solo permitir un punto decimal
        return;
      }
      if (parts[1] && parts[1].length > 2) {
        // Limitar a 2 decimales
        return;
      }
      setIncreaseValue(numValue);
    }
  };

  const handleConfirm = () => {
    if (!isFormValid) {
      return;
    }

    const value = parseFloat(increaseValue);
    onConfirm(selectedCategoryId, increaseType, value);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <ModalTitle>Aumento Masivo de Precios</ModalTitle>
            <ModalSubtitle>
              Aplica un aumento porcentual o fijo a todos los productos de una
              categoría.
            </ModalSubtitle>
          </div>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Fila 1: Selector de categoría y tipo de aumento */}
          <FormRow>
            <FormGroup style={{ flex: 1 }}>
              <Label>
                Categoría <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup style={{ flex: 1 }}>
              <Label>
                Tipo de Aumento <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Select
                value={increaseType}
                onChange={(e) => {
                  setIncreaseType(e.target.value as "fixed" | "percentage");
                  setIncreaseValue(""); // Resetear valor al cambiar tipo
                }}
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto Fijo ($)</option>
              </Select>
            </FormGroup>
          </FormRow>

          {/* Fila 2: Input del valor del aumento */}
          <FormRow>
            <FormGroup style={{ flex: 1 }}>
              <Label>
                {increaseType === "percentage" ? "Porcentaje" : "Monto"}{" "}
                <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Input
                type="text"
                value={increaseValue}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder={
                  increaseType === "percentage"
                    ? "Ej: 10 (para 10%)"
                    : "Ej: 100.50 (para $100.50)"
                }
              />
            </FormGroup>
          </FormRow>
        </ModalBody>

        {/* Botones */}
        <ButtonGroup>
          <CancelButton type="button" onClick={onClose}>
            Cancelar
          </CancelButton>
          <SaveButton type="button" onClick={handleConfirm} disabled={!isFormValid}>
            Aceptar
          </SaveButton>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
}
