import { useState, useMemo, useContext } from "react";
import { AppContext } from "../../../context/app";
import type { Product } from "../../../api/products";
import { isStockLow } from "../../../utils/stock";
import {
  FiltersContainer,
  SearchInput,
  SortSelect,
  CategorySelect,
  ClearFilterButton,
  StockTable,
  TableHeader,
  HeaderCell,
  TableRow,
  TableCell,
  TableCellFlex,
  ImageCell,
  ProductImage,
  ProductInfo,
  ProductName,
  ProductBarcode,
  StockValue,
  StockPill,
  StockPillNormal,
  StockPillLow,
} from "./StockListStyled";
import { FaTimes } from "react-icons/fa";

type SortField = "name" | "stock" | null;
type SortOrder = "asc" | "desc";

export default function StockList() {
  const { products, categories } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [sortBy, setSortBy] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Filtrar productos con stock > 0
  const productsWithStock = useMemo(() => {
    return products.filter((product) => parseFloat(product.current_stock) > 0);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = productsWithStock;

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
  }, [productsWithStock, searchTerm, selectedCategoryId, sortBy, sortOrder]);

  const handleClearCategoryFilter = () => {
    setSelectedCategoryId(null);
  };

  const handleSortChange = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Formatear stock según is_weighable
  const formatStock = (stock: string, isWeighable: boolean): string => {
    const value = parseFloat(stock) || 0;
    return isWeighable ? value.toFixed(2) : Math.round(value).toString();
  };

  // Obtener nombre de categoría por ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <>
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

      <StockTable>
        <TableHeader>
          <HeaderCell flex={2} alignLeft style={{ paddingLeft: "96px" }}>
            Producto
          </HeaderCell>
          <HeaderCell flex={1}>Categoría</HeaderCell>
          <HeaderCell flex={1}>Stock Actual</HeaderCell>
          <HeaderCell flex={1}>Stock Mínimo</HeaderCell>
          <HeaderCell flex={1}>Estado</HeaderCell>
        </TableHeader>
        {filteredProducts.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "var(--text-soft)",
            }}
          >
            No hay productos con stock disponible
          </div>
        ) : (
          filteredProducts.map((product) => {
            const stockLow = isStockLow(product);
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
                <TableCellFlex
                  style={{ flex: 2, justifyContent: "flex-start" }}
                >
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductBarcode>{product.barcode}</ProductBarcode>
                  </ProductInfo>
                </TableCellFlex>
                <TableCell style={{ flex: 1 }}>
                  <StockValue>
                    {getCategoryName(product.category_id)}
                  </StockValue>
                </TableCell>
                <TableCell style={{ flex: 1 }}>
                  <StockValue>{currentStockFormatted}</StockValue>
                </TableCell>
                <TableCell style={{ flex: 1 }}>
                  <StockValue>{minStockFormatted}</StockValue>
                </TableCell>
                <TableCell style={{ flex: 1 }}>
                  {stockLow ? (
                    <StockPillLow>Stock bajo</StockPillLow>
                  ) : (
                    <StockPillNormal>Normal</StockPillNormal>
                  )}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </StockTable>
    </>
  );
}
