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
  const [price, setPrice] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [currentStock, setCurrentStock] = useState<string>("");
  const [minStock, setMinStock] = useState<string>("");
  const [barcode, setBarcode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isWeighable, setIsWeighable] = useState(false);
  const [isEditablePrice, setIsEditablePrice] = useState(false);

  // Validar si el formulario es válido (campos obligatorios completos)
  const isFormValid = useMemo(() => {
    return name.trim() !== "" && categoryId !== "";
  }, [name, categoryId]);

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
    const randomBarcode = Math.random()
      .toString(36)
      .substring(2, 15)
      .toUpperCase();
    setBarcode(randomBarcode);
  };

  // Validar número con máximo 2 decimales (para price y cost)
  const validateDecimal = (value: string): string => {
    if (value === "") return value;
    // Permitir números con máximo 2 decimales
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value)) {
      return value;
    }
    return value.slice(0, -1);
  };

  // Validar número entero (para stock no pesable)
  const validateInteger = (value: string): string => {
    if (value === "") return value;
    const regex = /^\d*$/;
    if (regex.test(value)) {
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

  // Redondear a 2 decimales (para price y cost)
  const roundToTwoDecimals = (value: number): number => {
    return Math.round(value * 100) / 100;
  };

  // Redondear stock según si es pesable o no
  const roundStock = (value: number, isWeighable: boolean): number => {
    if (isWeighable) {
      return roundToTwoDecimals(value);
    } else {
      return Math.round(value);
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
      setPrice(product.price?.toString() || "");
      setCost(product.cost?.toString() || "");
      setCurrentStock(product.current_stock?.toString() || "");
      setMinStock(product.min_stock?.toString() || "");
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
    // Convertir strings a números y redondear correctamente
    const priceNum = roundToTwoDecimals(parseFloat(price) || 0);
    const costNum = roundToTwoDecimals(parseFloat(cost) || 0);
    const currentStockNum = roundStock(
      parseFloat(currentStock) || 0,
      isWeighable
    );
    const minStockNum = roundStock(parseFloat(minStock) || 0, isWeighable);

    const productData: Partial<Product> = {
      name,
      category_id: categoryId,
      price: priceNum,
      cost: costNum,
      current_stock: currentStockNum,
      min_stock: minStockNum,
      barcode: barcode.trim() || null,
      image_url: imageUrl.trim() || null,
      is_weighable: isWeighable,
      is_editable_price: isEditablePrice,
    };

    if (product) {
      productData.id = product.id;
      productData.business_id = product.business_id;
    }

    onSave(productData);
    // El modal se cerrará desde el componente padre después de que la operación sea exitosa
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <ModalTitle>
              {product ? "Editar Producto" : "Agregar Producto"}
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
          {/* Fila 1: Nombre y Categoría */}
          <FormRow>
            <FormGroup>
              <Label>
                Nombre <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del producto"
              />
            </FormGroup>
            <FormGroup>
              <Label>
                Categoría <span style={{ color: "#ef4444" }}>*</span>
              </Label>
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
                onChange={(e) => setCurrentStock(validateStock(e.target.value))}
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
                <FileUploadButton as="label">
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
