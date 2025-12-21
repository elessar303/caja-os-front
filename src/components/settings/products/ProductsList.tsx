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
import { isStockLow } from "../../../utils/stock";
import ProductModal from "./ProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
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

type SortField = "name" | "stock" | null;
type SortOrder = "asc" | "desc";

export default function ProductsList() {
  const { products, categories } = useContext(AppContext);
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
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.barcode.toLowerCase().includes(searchLower)
      );
    }

    // Ordenar
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;

        if (sortBy === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === "stock") {
          const stockA = parseFloat(a.current_stock) || 0;
          const stockB = parseFloat(b.current_stock) || 0;
          comparison = stockA - stockB;
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [products, searchTerm, selectedCategoryId, sortBy, sortOrder]);

  const calculateProfitPercentage = (product: Product): string => {
    const price = parseFloat(product.price) || 0;
    const cost = parseFloat(product.cost) || 0;
    if (price === 0) return "0.00";
    const profit = ((price - cost) / price) * 100;
    return profit.toFixed(2);
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
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    // Aquí implementarías la lógica para guardar el producto
    // Por ahora solo cerramos el modal
    console.log("Guardar producto:", productData);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Aquí implementarías la lógica para eliminar el producto
    console.log("Eliminar producto:", productToDelete);
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
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
          <HeaderActionButton type="button">
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
          <HeaderActionButton type="button">
            <FaArrowTrendUp
              style={{ display: "block", width: "14px", height: "14px" }}
            />
            Aumento Masivo
          </HeaderActionButton>
          <HeaderActionButton type="button" onClick={handleAddProduct}>
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

            // Formatear stock según is_weighable
            const formatStock = (
              stock: string,
              isWeighable: boolean
            ): string => {
              const value = parseFloat(stock) || 0;
              return isWeighable
                ? value.toFixed(2)
                : Math.round(value).toString();
            };

            const currentStockFormatted = formatStock(
              product.current_stock,
              product.is_weighable
            );
            const minStockFormatted = formatStock(
              product.min_stock,
              product.is_weighable
            );

            return (
              <TableRow key={product.id}>
                <ImageCell>
                  <ProductImage />
                </ImageCell>
                <TableCellFlex>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductBarcode>{product.barcode}</ProductBarcode>
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
                    <ProductPrice>
                      ${parseFloat(product.price).toFixed(2)}
                    </ProductPrice>
                    <ProductProfit>
                      Ganancia: {profitPercentage}%
                    </ProductProfit>
                  </div>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <ActionButton
                      type="button"
                      onClick={() => handleEditProduct(product)}
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
    </>
  );
}
