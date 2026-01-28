import { useState, useEffect, useMemo } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
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
  ButtonGroup,
  CancelButton,
  SaveButton,
} from "./CategoryModalStyled";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Partial<Category>) => void;
  category?: Category | null;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSave,
  category,
}: CategoryModalProps) {
  const [name, setName] = useState("");

  // Validar formulario - el nombre es obligatorio
  const isFormValid = useMemo(() => {
    return name.trim().length > 0;
  }, [name]);

  // Cargar datos de la categoría si está en modo edición
  useEffect(() => {
    if (category && isOpen) {
      setName(category.name || "");
    } else if (isOpen) {
      // Resetear formulario para nueva categoría
      setName("");
    }
  }, [category, isOpen]);

  const handleSave = () => {
    if (!isFormValid) {
      return;
    }

    const categoryData: Partial<Category> = {
      name: name.trim(),
    };

    if (category) {
      categoryData.id = category.id;
      categoryData.business_id = category.business_id;
    }

    onSave(categoryData);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <ModalTitle>
              {category ? "Editar Categoría" : "Agregar Categoría"}
            </ModalTitle>
            <ModalSubtitle>
              Complete los datos. Los campos marcados con{" "}
              <span style={{ color: "#ef4444" }}>*</span> son obligatorios
            </ModalSubtitle>
          </div>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormRow>
            <FormGroup style={{ flex: 1 }}>
              <Label>
                Nombre de la Categoría{" "}
                <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre de la categoría"
              />
            </FormGroup>
          </FormRow>
        </ModalBody>

        {/* Botones */}
        <ButtonGroup>
          <CancelButton type="button" onClick={onClose}>
            Cancelar
          </CancelButton>
          <SaveButton type="button" onClick={handleSave} disabled={!isFormValid}>
            <FaSave />
            Guardar
          </SaveButton>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
}
