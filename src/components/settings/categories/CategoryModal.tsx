import { useState, useEffect } from "react";
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

  // Cargar datos de la categoría si está en modo edición
  useEffect(() => {
    if (category) {
      setName(category.name || "");
    } else {
      // Resetear formulario para nueva categoría
      setName("");
    }
  }, [category, isOpen]);

  const handleSave = () => {
    const categoryData: Partial<Category> = {
      name,
    };

    if (category) {
      categoryData.id = category.id;
      categoryData.business_id = category.business_id;
    }

    onSave(categoryData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <ModalTitle>
              {category ? "Editar Categoría" : "Agregar Categoría"}
            </ModalTitle>
            <ModalSubtitle>Complete los datos de la categoría</ModalSubtitle>
          </div>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormRow>
            <FormGroup style={{ flex: 1 }}>
              <Label>Nombre de la Categoría</Label>
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
          <SaveButton type="button" onClick={handleSave}>
            <FaSave />
            Guardar
          </SaveButton>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
}

