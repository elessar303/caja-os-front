import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { GridContainer, Grid, LoadingMessage } from "./styled";
import ProductCard from "./ProductCard";
import Footer from "../layout/footer";
import { AppContext } from "../../context/app";

interface ProductGridProps {
  searchTerm: string;
}

export default function ProductGrid({ searchTerm }: ProductGridProps) {
  const { products, productsLoading } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const gridRef = useRef<HTMLDivElement>(null);

  // Filtrar productos por nombre o código de barras
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.barcode.toLowerCase().includes(searchLower)
    );
  }, [products, searchTerm]);

  // Calcular cuántos productos caben en la grid
  useEffect(() => {
    const calculateProductsPerPage = () => {
      if (gridRef.current) {
        const grid = gridRef.current;
        const gridWidth = grid.clientWidth - 32; // Restar padding
        const cardWidth = 180; // Tamaño mínimo de la grilla
        const gap = 16;
        const columns = Math.floor((gridWidth + gap) / (cardWidth + gap));

        // Calcular filas visibles (altura disponible menos padding y footer)
        // Las tarjetas son cuadradas (aspect-ratio: 1), así que la altura es igual al ancho
        const gridHeight = grid.clientHeight;
        const cardHeight = cardWidth; // Las tarjetas son cuadradas
        const footerHeight = 80; // Altura del footer
        const availableHeight = gridHeight - footerHeight;
        const rows = Math.floor((availableHeight + gap) / (cardHeight + gap));

        const total = Math.max(1, columns * rows);
        setProductsPerPage(total);
      }
    };

    calculateProductsPerPage();

    // Usar ResizeObserver para detectar cambios de tamaño (incluyendo zoom)
    const resizeObserver = new ResizeObserver(() => {
      calculateProductsPerPage();
    });

    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    }

    window.addEventListener("resize", calculateProductsPerPage);

    // También escuchar cambios de zoom usando el evento visualViewport
    const handleViewportChange = () => {
      setTimeout(calculateProductsPerPage, 50);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
      window.visualViewport.addEventListener("scroll", handleViewportChange);
    }

    // Recalcular después de un pequeño delay para asegurar que el DOM esté renderizado
    const timeoutId = setTimeout(calculateProductsPerPage, 100);

    return () => {
      window.removeEventListener("resize", calculateProductsPerPage);
      resizeObserver.disconnect();
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportChange
        );
        window.visualViewport.removeEventListener(
          "scroll",
          handleViewportChange
        );
      }
      clearTimeout(timeoutId);
    };
  }, []);

  // Resetear a página 1 cuando cambian los productos filtrados o el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  if (productsLoading) {
    return (
      <GridContainer>
        <Grid ref={gridRef}>
          <LoadingMessage>Cargando productos...</LoadingMessage>
        </Grid>
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      <Grid ref={gridRef}>
        {currentProducts.length > 0 ? (
          currentProducts.map((p, i) => (
            <ProductCard
              key={`${p.name}-${startIndex + i}`}
              name={p.name}
              price={p.price}
              barcode={p.barcode}
            />
          ))
        ) : (
          <LoadingMessage>No hay productos disponibles</LoadingMessage>
        )}
      </Grid>
      {filteredProducts.length > 0 && (
        <Footer
          currentPage={currentPage}
          totalPages={totalPages}
          onFirst={handleFirstPage}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
          onLast={handleLastPage}
        />
      )}
    </GridContainer>
  );
}
