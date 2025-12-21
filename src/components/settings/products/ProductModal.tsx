import { useState, useEffect, useMemo } from "react";
import { FaTimes, FaSave, FaBarcode } from "react-icons/fa";
import type { Product } from "../../../api/products";
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
  ReadOnlyInput,
  SwitchContainer,
  Switch,
  SwitchLabel,
  SwitchDescription,
  ButtonGroup,
  GenerateButton,
  FileUploadButton,
  FileInput,
  FieldDescription,
  CancelButton,
  SaveButton,
} from "./ProductModalStyled";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  product?: Product | null;
  categories: Category[];
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
  categories,
}: ProductModalProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [barcode, setBarcode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isWeighable, setIsWeighable] = useState(false);
  const [isEditablePrice, setIsEditablePrice] = useState(false);

  // Calcular ganancia en porcentaje
  const profitPercentage = useMemo(() => {
    const priceValue = parseFloat(price) || 0;
    const costValue = parseFloat(cost) || 0;
    if (priceValue === 0) return "0.00";
    const profit = ((priceValue - costValue) / priceValue) * 100;
    return profit.toFixed(2);
  }, [price, cost]);

  // Generar código de barras aleatorio
  const generateBarcode = () => {
    const randomBarcode = Math.random().toString(36).substring(2, 15).toUpperCase();
    setBarcode(randomBarcode);
  };

  // Validar número con 2 decimales
  const validateDecimal = (value: string): string => {
    const regex = /^\d*\.?\d{0,2}$/;
    if (value === "" || regex.test(value)) {
      return value;
    }
    return value.slice(0, -1);
  };

  // Validar número entero
  const validateInteger = (value: string): string => {
    const regex = /^\d*$/;
    if (value === "" || regex.test(value)) {
      return value;
    }
    return value.slice(0, -1);
  };

  // Validar stock según si es pesable o no
  const validateStock = (value: string): string => {
    if (isWeighable) {
      return validateDecimal(value);
    } else {
      return validateInteger(value);
    }
  };

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo no puede pesar más de 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Solo se permiten archivos de imagen");
        return;
      }
      // Aquí podrías convertir a base64 o subir el archivo
      // Por ahora solo validamos
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cargar datos del producto si está en modo edición
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setCategoryId(product.category_id || "");
      setPrice(product.price || "");
      setCost(product.cost || "");
      setCurrentStock(product.current_stock || "");
      setMinStock(product.min_stock || "");
      setBarcode(product.barcode || "");
      setImageUrl(product.image_url || "");
      setIsWeighable(product.is_weighable || false);
      setIsEditablePrice(product.is_editable_price || false);
    } else {
      // Resetear formulario para nuevo producto
      setName("");
      setCategoryId("");
      setPrice("");
      setCost("");
      setCurrentStock("");
      setMinStock("");
      setBarcode("");
      setImageUrl("");
      setIsWeighable(false);
      setIsEditablePrice(false);
    }
  }, [product, isOpen]);

  const handleSave = () => {
    const productData: Partial<Product> = {
      name,
      category_id: categoryId,
      price,
      cost,
      current_stock: currentStock,
      min_stock: minStock,
      barcode,
      image_url: imageUrl,
      is_weighable: isWeighable,
      is_editable_price: isEditablePrice,
    };

    if (product) {
      productData.id = product.id;
      productData.business_id = product.business_id;
    }

    onSave(productData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <ModalTitle>
              {product ? "Editar Producto" : "Agregar Producto"}
            </ModalTitle>
            <ModalSubtitle>Complete los datos del producto</ModalSubtitle>
          </div>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Fila 1: Nombre y Categoría */}
          <FormRow>
            <FormGroup>
              <Label>Nombre</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del producto"
              />
            </FormGroup>
            <FormGroup>
              <Label>Categoría</Label>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </FormRow>

          {/* Fila 2: Precio, Costo, Ganancia */}
          <FormRow>
            <FormGroup>
              <Label>Precio de Venta</Label>
              <Input
                type="text"
                value={price}
                onChange={(e) => setPrice(validateDecimal(e.target.value))}
                placeholder="0.00"
              />
            </FormGroup>
            <FormGroup>
              <Label>Costo</Label>
              <Input
                type="text"
                value={cost}
                onChange={(e) => setCost(validateDecimal(e.target.value))}
                placeholder="0.00"
              />
            </FormGroup>
            <FormGroup>
              <Label>Ganancia</Label>
              <ReadOnlyInput
                type="text"
                value={`${profitPercentage}%`}
                readOnly
              />
            </FormGroup>
          </FormRow>

          {/* Fila 3: Stock Actual y Stock Mínimo */}
          <FormRow>
            <FormGroup>
              <Label>Stock Actual</Label>
              <Input
                type="text"
                value={currentStock}
                onChange={(e) =>
                  setCurrentStock(validateStock(e.target.value))
                }
                placeholder={isWeighable ? "0.00" : "0"}
              />
            </FormGroup>
            <FormGroup>
              <Label>Stock Mínimo</Label>
              <Input
                type="text"
                value={minStock}
                onChange={(e) => setMinStock(validateStock(e.target.value))}
                placeholder={isWeighable ? "0.00" : "0"}
              />
            </FormGroup>
          </FormRow>

          {/* Fila 4: Código de Barras */}
          <FormRow>
            <FormGroup style={{ flex: 1 }}>
              <Label>Código de Barras</Label>
              <div style={{ display: "flex", gap: "8px" }}>
                <Input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value.toUpperCase())}
                  placeholder="Código de barras"
                  style={{ flex: 1 }}
                />
                <GenerateButton type="button" onClick={generateBarcode}>
                  <FaBarcode />
                  Generar
                </GenerateButton>
              </div>
            </FormGroup>
          </FormRow>

          {/* Fila 5: Imagen */}
          <FormRow>
            <FormGroup style={{ flex: 1 }}>
              <Label>Imagen del Producto</Label>
              <div style={{ display: "flex", gap: "8px" }}>
                <Input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL de la imagen"
                  style={{ flex: 1 }}
                />
                <FileUploadButton type="button" as="label">
                  <FileInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  Subir Imagen
                </FileUploadButton>
              </div>
              <FieldDescription>
                Puedes ingresar una URL o subir una imagen desde tu dispositivo
                (máx. 5MB)
              </FieldDescription>
            </FormGroup>
          </FormRow>

          {/* Fila 6: Switches */}
          <FormRow>
            <FormGroup>
              <SwitchContainer>
                <Switch
                  type="checkbox"
                  checked={isWeighable}
                  onChange={(e) => setIsWeighable(e.target.checked)}
                />
                <SwitchLabel>Producto Pesable</SwitchLabel>
              </SwitchContainer>
              <SwitchDescription>
                El producto se vende por peso (kg)
              </SwitchDescription>
            </FormGroup>
            <FormGroup>
              <SwitchContainer>
                <Switch
                  type="checkbox"
                  checked={isEditablePrice}
                  onChange={(e) => setIsEditablePrice(e.target.checked)}
                />
                <SwitchLabel>Precio Editable</SwitchLabel>
              </SwitchContainer>
              <SwitchDescription>
                Permite modificar el precio al vender
              </SwitchDescription>
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

