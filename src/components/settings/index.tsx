import { useRef, useEffect, useState } from "react";
import {
  FaHistory,
  FaShoppingCart,
  FaTable,
  FaBoxes,
  FaFileInvoice,
  FaPrint,
  FaBox,
  FaUsers,
  FaCashRegister,
  FaChartBar,
} from "react-icons/fa";
import { SettingsGrid, SettingsCard, SettingsIcon, SettingsTitle, SettingsSubtitle } from "./styled";

interface SettingsOption {
  titulo: string;
  subtitulo: string;
  icon: React.ReactNode;
}

const settingsOptions: SettingsOption[] = [
  {
    titulo: "Historical de Ventas",
    subtitulo: "Ver historial de ventas realizadas",
    icon: <FaHistory />,
  },
  {
    titulo: "Pedidos",
    subtitulo: "Ver pedidos en preparación y pendientes",
    icon: <FaShoppingCart />,
  },
  {
    titulo: "Gestión de Mesas",
    subtitulo: "Administrar mesas y pedidos",
    icon: <FaTable />,
  },
  {
    titulo: "Stock",
    subtitulo: "Control de inventario y stock",
    icon: <FaBoxes />,
  },
  {
    titulo: "Facturación",
    subtitulo: "Próximamente disponible",
    icon: <FaFileInvoice />,
  },
  {
    titulo: "Opciones de Impresión",
    subtitulo: "Configurar impresoras y tickets",
    icon: <FaPrint />,
  },
  {
    titulo: "Productos",
    subtitulo: "Gestionar productos y categorías",
    icon: <FaBox />,
  },
  {
    titulo: "Usuarios",
    subtitulo: "Administrar usuarios y permisos",
    icon: <FaUsers />,
  },
  {
    titulo: "Cierre de Caja",
    subtitulo: "Realizar cierre de caja",
    icon: <FaCashRegister />,
  },
  {
    titulo: "Reportes",
    subtitulo: "Ver reportes y estadísticas",
    icon: <FaChartBar />,
  },
];

export default function Settings() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState<number | undefined>(undefined);
  const totalItems = settingsOptions.length;
  const itemsPerRow = 4;
  const totalRows = Math.ceil(totalItems / itemsPerRow);
  const fullRows = Math.floor(totalItems / itemsPerRow);
  const itemsInLastRow = totalItems % itemsPerRow;
  const isLastRowIncomplete = itemsInLastRow > 0 && itemsInLastRow < itemsPerRow;
  const startIndexLastRow = fullRows * itemsPerRow;

  useEffect(() => {
    const calculateCardSize = () => {
      if (gridRef.current) {
        const grid = gridRef.current;
        const gridHeight = grid.clientHeight;
        const gridPadding = 40; // 20px top + 20px bottom
        const gap = 16;
        const availableHeight = gridHeight - gridPadding;
        const totalGaps = (totalRows - 1) * gap;
        const cardHeight = Math.floor((availableHeight - totalGaps) / totalRows);
        setCardSize(cardHeight);
      }
    };

    calculateCardSize();

    const resizeObserver = new ResizeObserver(() => {
      calculateCardSize();
    });

    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    }

    window.addEventListener("resize", calculateCardSize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", calculateCardSize);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateCardSize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", calculateCardSize);
      }
    };
  }, [totalRows]);

  return (
    <SettingsGrid ref={gridRef} cardSize={cardSize}>
      {settingsOptions.map((option, index) => {
        const isInLastRow = index >= startIndexLastRow;
        const isLastRowItem = isInLastRow && isLastRowIncomplete;
        
        let gridColumnStyle: React.CSSProperties | undefined;
        if (isLastRowItem) {
          const positionInLastRow = index - startIndexLastRow;
          const offset = Math.floor((itemsPerRow - itemsInLastRow) / 2);
          gridColumnStyle = {
            gridColumn: `${offset + positionInLastRow + 1} / span 1`,
          };
        }

        return (
          <SettingsCard key={index} cardSize={cardSize} style={gridColumnStyle}>
            <SettingsIcon>{option.icon}</SettingsIcon>
            <SettingsTitle>{option.titulo}</SettingsTitle>
            <SettingsSubtitle>{option.subtitulo}</SettingsSubtitle>
          </SettingsCard>
        );
      })}
    </SettingsGrid>
  );
}

