import { useState, useMemo, useContext } from "react";
import {
  FaEdit,
  FaTrash,
  FaTimes,
  FaPlus,
  FaFileDownload,
  FaFileUpload,
} from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { AppContext } from "../../../context/app";
import type { Product } from "../../../api/products";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateProductPrices,
} from "../../../api/products";
import { isStockLow } from "../../../utils/stock";
import {
  matchesProductSearch,
  getProductImageUrl,
} from "../../../utils/productSearch";
import ProductModal from "./ProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import BulkPriceUpdateModal from "./BulkPriceUpdateModal";
import {
  HeaderSection,
  TitleSection,
  Title,
  Description,
  ActionsContainer,
  HeaderActionButton,
  FiltersContainer,
  SearchInput,
  SortSelect,
  CategorySelect,
  ClearFilterButton,
  ProductsTable,
  TableRow,
  TableCell,
  TableCellFlex,
  ImageCell,
  ProductImage,
  ProductImagePlaceholder,
  ProductInfo,
  ProductName,
  ProductBarcode,
  ProductStock,
  StockLowPill,
  ProductPrice,
  ProductProfit,
  ActionButtons,
  ActionButton,
  DeleteButton,
} from "./ProductsListStyled";
import Alert from "../../common/alert";

type SortField = "name" | "stock" | null;
type SortOrder = "asc" | "desc";

export default function ProductsList() {
  const { products, categories, currentUser, currentBusiness, loadProducts } =
    useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [sortBy, setSortBy] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtrar por categoría
    if (selectedCategoryId) {
      filtered = filtered.filter(
        (product) => product.category_id === selectedCategoryId
      );
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter((product) =>
        matchesProductSearch(product, searchTerm)
      );
    }

    // Ordenar
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;

        if (sortBy === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === "stock") {
          const stockA = a.current_stock || 0;
          const stockB = b.current_stock || 0;
          comparison = stockA - stockB;
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [products, searchTerm, selectedCategoryId, sortBy, sortOrder]);

  const calculateProfitPercentage = (product: Product): string => {
    const priceValue = product.price || 0;
    const costValue = product.cost || 0;
    if (priceValue === 0) return "0.00";
    const profit = ((priceValue - costValue) / priceValue) * 100;
    return profit.toFixed(2);
  };

  // Formatear stock según is_weighable
  const formatStock = (stock: number, isWeighable: boolean): string => {
    const value = stock || 0;
    return isWeighable ? value.toFixed(2) : Math.round(value).toString();
  };

  // Formatear precio/costo con máximo 2 decimales
  const formatPrice = (value: number): string => {
    const numValue = value || 0;
    return numValue.toFixed(2);
  };

  const handleClearCategoryFilter = () => {
    setSelectedCategoryId(null);
  };

  const handleSortChange = (field: SortField) => {
    if (sortBy === field) {
      // Si ya está ordenando por ese campo, cambiar el orden
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Si es un campo nuevo, establecerlo y empezar con asc
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleAddProduct = () => {
    if (isBulkUpdating) {
      return;
    }
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    if (isBulkUpdating) {
      return;
    }
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (!currentUser?.business_id) {
      setSnackbarMessage("Error: No hay usuario logueado");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      if (editingProduct) {
        // Editar producto existente
        if (!productData.id) {
          throw new Error("ID de producto no encontrado");
        }
        // Asegurar que los valores numéricos estén correctamente formateados
        const priceNum =
          productData.price !== undefined
            ? Math.round(productData.price * 100) / 100
            : undefined;
        const costNum =
          productData.cost !== undefined
            ? Math.round(productData.cost * 100) / 100
            : undefined;
        const isWeighable =
          productData.is_weighable !== undefined
            ? productData.is_weighable
            : editingProduct.is_weighable;
        const currentStockNum =
          productData.current_stock !== undefined
            ? isWeighable
              ? Math.round(productData.current_stock * 100) / 100
              : Math.round(productData.current_stock)
            : undefined;
        const minStockNum =
          productData.min_stock !== undefined
            ? isWeighable
              ? Math.round(productData.min_stock * 100) / 100
              : Math.round(productData.min_stock)
            : undefined;

        const updateData: Partial<
          Omit<Product, "id" | "business_id" | "created_at">
        > = {
          ...productData,
        };

        if (priceNum !== undefined) updateData.price = priceNum;
        if (costNum !== undefined) updateData.cost = costNum;
        if (currentStockNum !== undefined)
          updateData.current_stock = currentStockNum;
        if (minStockNum !== undefined) updateData.min_stock = minStockNum;

        await updateProduct(
          productData.id,
          updateData,
          currentUser.business_id
        );
        setSnackbarMessage("Producto actualizado exitosamente");
        setSnackbarSeverity("success");
      } else {
        // Crear nuevo producto
        // Asegurar que los valores numéricos estén correctamente formateados
        const priceNum = productData.price
          ? Math.round(productData.price * 100) / 100
          : 0;
        const costNum = productData.cost
          ? Math.round(productData.cost * 100) / 100
          : 0;
        const isWeighable = productData.is_weighable || false;
        const currentStockNum =
          productData.current_stock !== undefined
            ? isWeighable
              ? Math.round(productData.current_stock * 100) / 100
              : Math.round(productData.current_stock)
            : 0;
        const minStockNum =
          productData.min_stock !== undefined
            ? isWeighable
              ? Math.round(productData.min_stock * 100) / 100
              : Math.round(productData.min_stock)
            : 0;

        const newProductData: Omit<
          Product,
          "id" | "created_at" | "updated_at"
        > = {
          business_id: currentUser.business_id,
          category_id: productData.category_id || "",
          name: productData.name || "",
          barcode: productData.barcode || "",
          price: priceNum,
          cost: costNum,
          image_url: productData.image_url?.trim() || null,
          is_weighable: isWeighable,
          is_editable_price: productData.is_editable_price || false,
          tax_included: productData.tax_included ?? true,
          current_stock: currentStockNum,
          min_stock: minStockNum,
        };
        await createProduct(newProductData);
        setSnackbarMessage("Producto creado exitosamente");
        setSnackbarSeverity("success");
      }

      // Recargar la lista de productos
      await loadProducts();

      // Cerrar modal
      setIsModalOpen(false);
      setEditingProduct(null);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving product:", error);
      setSnackbarMessage(
        error instanceof Error ? error.message : "Error al guardar el producto"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleBulkPriceUpdate = async (
    categoryId: string,
    increaseType: "fixed" | "percentage",
    increaseValue: number
  ) => {
    if (!currentUser?.business_id) {
      setSnackbarMessage("Error: No hay usuario logueado");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsBulkUpdateModalOpen(false);
      return;
    }

    // Obtener nombre de la categoría para el mensaje de confirmación
    const category = categories.find((c) => c.id === categoryId);
    const categoryName = category?.name || "la categoría seleccionada";

    // Crear mensaje de confirmación mejorado
    const increaseText =
      increaseType === "percentage"
        ? `aumento del ${increaseValue}%`
        : `aumento de $${increaseValue.toFixed(2)}`;

    const confirmed = window.confirm(
      `¿Está seguro de aplicar un ${increaseText} a todos los productos de la categoría "${categoryName}"?\n\nEsta acción actualizará el precio de todos los productos de esta categoría y no se puede deshacer.`
    );

    if (!confirmed) {
      return;
    }

    // Cerrar modal de configuración
    setIsBulkUpdateModalOpen(false);

    // Activar loading global
    setIsBulkUpdating(true);

    try {
      const updatedCount = await bulkUpdateProductPrices(
        categoryId,
        currentUser.business_id,
        increaseType,
        increaseValue
      );

      // Recargar productos
      await loadProducts();

      // Mostrar notificación de éxito
      setSnackbarMessage(
        `Aumento masivo aplicado exitosamente: ${updatedCount} producto(s) actualizado(s)`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error bulk updating prices:", error);
      setSnackbarMessage(
        error instanceof Error
          ? error.message
          : "Error al aplicar el aumento masivo"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      // Desactivar loading global
      setIsBulkUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete?.id) {
      setSnackbarMessage(
        "Error: No se pudo identificar el producto a eliminar"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      return;
    }

    if (!currentUser?.business_id) {
      setSnackbarMessage("Error: No hay usuario logueado");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      return;
    }

    try {
      await deleteProduct(productToDelete.id, currentUser.business_id);

      // Recargar la lista de productos
      await loadProducts();

      // Cerrar modal de confirmación
      setIsDeleteModalOpen(false);
      setProductToDelete(null);

      // Mostrar notificación de éxito
      setSnackbarMessage("Producto eliminado exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting product:", error);
      setSnackbarMessage(
        error instanceof Error ? error.message : "Error al eliminar el producto"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      // Cerrar modal de confirmación incluso si hay error
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleExportCSV = () => {
    // Validar que haya productos para exportar
    if (!filteredProducts.length) {
      setSnackbarMessage("No hay productos para exportar");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (!currentBusiness) {
      setSnackbarMessage("Error: No hay información del negocio disponible");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      // Usar el nombre del negocio del contexto
      const businessName = currentBusiness.name || "export";

      // Sanitizar nombre del negocio para usar en nombre de archivo
      const sanitizeFileName = (name: string): string => {
        return name
          .replace(/[^a-zA-Z0-9-_]/g, "_")
          .replace(/_+/g, "_")
          .replace(/^_|_$/g, "")
          .toLowerCase();
      };

      const sanitizedBusinessName = sanitizeFileName(businessName);

      // Crear encabezados del CSV
      const headers = [
        "id",
        "name",
        "barcode",
        "category",
        "price",
        "cost",
        "stock",
        "min_stock",
        "is_weighable",
        "is_editable_price",
        "image_url",
      ];

      // Crear filas del CSV
      const rows = filteredProducts.map((product) => {
        const category = categories.find((c) => c.id === product.category_id);

        // Escapar comillas en los valores de texto
        const escapeCSV = (value: string | null | undefined): string => {
          if (!value) return "";
          const str = String(value);
          // Si contiene comillas o comas, envolver en comillas y escapar comillas internas
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };

        return [
          product.id,
          escapeCSV(product.name),
          escapeCSV(product.barcode),
          escapeCSV(category?.name),
          product.price.toFixed(2),
          product.cost.toFixed(2),
          formatStock(product.current_stock, product.is_weighable),
          formatStock(product.min_stock, product.is_weighable),
          product.is_weighable ? "SI" : "NO",
          product.is_editable_price ? "SI" : "NO",
          escapeCSV(product.image_url),
        ].join(",");
      });

      // Combinar encabezados y filas
      const csv = [headers.join(","), ...rows].join("\n");

      // Crear blob y descargar
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);

      // Generar nombre de archivo con nombre del negocio y fecha
      const date = new Date().toISOString().split("T")[0];
      link.setAttribute(
        "download",
        `productos-${sanitizedBusinessName}-${date}.csv`
      );

      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Liberar URL del blob
      URL.revokeObjectURL(url);

      // Mostrar notificación de éxito
      setSnackbarMessage(
        `CSV exportado exitosamente: ${filteredProducts.length} producto(s)`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setSnackbarMessage(
        error instanceof Error
          ? error.message
          : "Error al exportar el archivo CSV"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <HeaderSection>
        <TitleSection>
          <Title>Listado de Productos</Title>
          <Description>
            Cantidad registrada: {filteredProducts.length}
          </Description>
        </TitleSection>
        <ActionsContainer>
          <HeaderActionButton type="button" onClick={handleExportCSV}>
            <FaFileDownload
              style={{ display: "block", width: "14px", height: "14px" }}
            />
            Exportar CSV
          </HeaderActionButton>
          <HeaderActionButton type="button">
            <FaFileUpload
              style={{ display: "block", width: "14px", height: "14px" }}
            />
            Importar CSV
          </HeaderActionButton>
          <HeaderActionButton
            type="button"
            onClick={() => setIsBulkUpdateModalOpen(true)}
            disabled={isBulkUpdating}
          >
            <FaArrowTrendUp
              style={{ display: "block", width: "14px", height: "14px" }}
            />
            Aumento Masivo
          </HeaderActionButton>
          <HeaderActionButton
            type="button"
            onClick={handleAddProduct}
            disabled={isBulkUpdating}
          >
            <FaPlus
              style={{ display: "block", width: "14px", height: "14px" }}
            />
            Agregar
          </HeaderActionButton>
        </ActionsContainer>
      </HeaderSection>
      <FiltersContainer>
        <SearchInput
          type="text"
          placeholder="Buscar por nombre o código de barras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <SortSelect
            value={
              sortBy === "name" ? "name" : sortBy === "stock" ? "stock" : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value === "name" || value === "stock") {
                handleSortChange(value);
              } else {
                setSortBy(null);
                setSortOrder("asc");
              }
            }}
          >
            <option value="">Ordenar por...</option>
            <option value="name">Nombre</option>
            <option value="stock">Stock</option>
          </SortSelect>
          {sortBy && (
            <SortSelect
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </SortSelect>
          )}
          <CategorySelect
            value={selectedCategoryId || ""}
            onChange={(e) => setSelectedCategoryId(e.target.value || null)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </CategorySelect>
          {selectedCategoryId && (
            <ClearFilterButton
              onClick={handleClearCategoryFilter}
              type="button"
            >
              <FaTimes
                style={{ display: "block", width: "14px", height: "14px" }}
              />
            </ClearFilterButton>
          )}
        </div>
      </FiltersContainer>

      <ProductsTable>
        {filteredProducts.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "var(--text-soft)",
            }}
          >
            No hay productos disponibles
          </div>
        ) : (
          filteredProducts.map((product) => {
            const profitPercentage = calculateProfitPercentage(product);
            const stockLow = isStockLow(product);

            const currentStockFormatted = formatStock(
              product.current_stock,
              product.is_weighable
            );
            const minStockFormatted = formatStock(
              product.min_stock,
              product.is_weighable
            );

            const imageUrl = getProductImageUrl(product.image_url);

            return (
              <TableRow key={product.id}>
                <ImageCell>
                  {imageUrl ? (
                    <ProductImage src={imageUrl} alt={product.name} />
                  ) : (
                    <ProductImagePlaceholder />
                  )}
                </ImageCell>
                <TableCellFlex>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductBarcode>{product.barcode || "-"}</ProductBarcode>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        marginTop: "4px",
                      }}
                    >
                      <ProductStock>
                        Stock: {currentStockFormatted} (Min: {minStockFormatted}
                        )
                      </ProductStock>
                      {stockLow && <StockLowPill>Stock bajo</StockLowPill>}
                    </div>
                  </ProductInfo>
                </TableCellFlex>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "4px",
                    }}
                  >
                    <ProductPrice>${formatPrice(product.price)}</ProductPrice>
                    <ProductProfit>Ganancia: {profitPercentage}%</ProductProfit>
                  </div>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <ActionButton
                      type="button"
                      onClick={() => handleEditProduct(product)}
                      disabled={isBulkUpdating}
                    >
                      <FaEdit
                        style={{
                          display: "block",
                          width: "14px",
                          height: "14px",
                        }}
                      />
                    </ActionButton>
                    <DeleteButton
                      type="button"
                      onClick={() => handleDeleteProduct(product)}
                      disabled={isBulkUpdating}
                    >
                      <FaTrash
                        style={{
                          display: "block",
                          width: "14px",
                          height: "14px",
                        }}
                      />
                    </DeleteButton>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </ProductsTable>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={productToDelete?.name || ""}
        itemType="product"
        barcode={productToDelete?.barcode}
      />
      <BulkPriceUpdateModal
        isOpen={isBulkUpdateModalOpen}
        onClose={() => setIsBulkUpdateModalOpen(false)}
        onConfirm={handleBulkPriceUpdate}
        categories={categories}
      />
      <Alert
        onOpen={snackbarOpen}
        onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
      {isBulkUpdating && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "4px solid rgba(255, 255, 255, 0.3)",
                borderTop: "4px solid #ffffff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <div
              style={{
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              Actualizando precios...
            </div>
          </div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
}
