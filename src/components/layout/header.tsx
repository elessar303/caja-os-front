import { useContext, useState } from "react";
import {
  FaSync,
  FaSun,
  FaBars,
  FaMoon,
  FaTag,
  FaTable,
  FaShoppingCart,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaQrcode,
  FaCashRegister,
  FaArrowLeft,
} from "react-icons/fa";
import {
  HeaderContainer,
  HeaderGroup,
  HeaderItem,
  MiddleHeaderButton,
  MiddleHeaderGroup,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "./styled";
import { ThemeContext } from "../../context/theme";
import { AppContext } from "../../context/app";

interface HeaderProps {
  isSettingsOpen: boolean;
  onSettingsToggle: () => void;
  onBackToMain: () => void;
  settingsView?: "main" | "products" | "stock" | "users";
}

export default function Header({
  isSettingsOpen,
  onSettingsToggle,
  onBackToMain,
  settingsView = "main",
}: HeaderProps) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { sellProducts } = useContext(AppContext);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  
  const canCharge = sellProducts.length > 0;

  return (
    <HeaderContainer>
      {/* IZQUIERDA: Auto, Sync, Descuento - Oculto cuando settings está abierto */}
      {!isSettingsOpen ? (
        <HeaderGroup>
          <HeaderItem>
            <button className="auto-btn">Auto ✓</button>
          </HeaderItem>

          <HeaderItem>
            <FaSync />
          </HeaderItem>

          <HeaderItem>
            <FaTag />
            <span>Descuento</span>
          </HeaderItem>
        </HeaderGroup>
      ) : (
        <HeaderGroup>
          <HeaderItem onClick={onBackToMain}>
            <FaArrowLeft />
          </HeaderItem>
          <Breadcrumb>
            <BreadcrumbItem isActive={settingsView === "main"}>
              Configuración
            </BreadcrumbItem>
            {settingsView === "products" && (
              <>
                <BreadcrumbSeparator> / </BreadcrumbSeparator>
                <BreadcrumbItem isActive>Productos</BreadcrumbItem>
              </>
            )}
            {settingsView === "stock" && (
              <>
                <BreadcrumbSeparator> / </BreadcrumbSeparator>
                <BreadcrumbItem isActive>Stock</BreadcrumbItem>
              </>
            )}
            {settingsView === "users" && (
              <>
                <BreadcrumbSeparator> / </BreadcrumbSeparator>
                <BreadcrumbItem isActive>Usuarios</BreadcrumbItem>
              </>
            )}
          </Breadcrumb>
        </HeaderGroup>
      )}

      {/* MEDIO: Mesas, Pedidos, Cobrar, Efectivo, Transferencia, QR Tarjeta - Oculto cuando settings está abierto */}
      {!isSettingsOpen && (
        <MiddleHeaderGroup>
          <MiddleHeaderButton
            isActive={activeButton === "mesas"}
            isFirst
            onClick={() =>
              setActiveButton(activeButton === "mesas" ? null : "mesas")
            }
          >
            <FaTable />
            <span>Mesas</span>
          </MiddleHeaderButton>

          <MiddleHeaderButton
            isActive={activeButton === "pedidos"}
            onClick={() =>
              setActiveButton(activeButton === "pedidos" ? null : "pedidos")
            }
          >
            <FaShoppingCart />
            <span>Pedidos</span>
          </MiddleHeaderButton>

          <MiddleHeaderButton
            isActive={activeButton === "cobrar"}
            disabled={!canCharge}
            onClick={() => {
              if (canCharge) {
                setActiveButton(activeButton === "cobrar" ? null : "cobrar");
              }
            }}
          >
            <FaCashRegister />
            <span>COBRAR</span>
          </MiddleHeaderButton>

          <MiddleHeaderButton
            isActive={activeButton === "efectivo"}
            onClick={() =>
              setActiveButton(activeButton === "efectivo" ? null : "efectivo")
            }
          >
            <FaMoneyBillWave />
            <span>Efectivo</span>
          </MiddleHeaderButton>

          <MiddleHeaderButton
            isActive={activeButton === "transferencia"}
            onClick={() =>
              setActiveButton(
                activeButton === "transferencia" ? null : "transferencia"
              )
            }
          >
            <FaExchangeAlt />
            <span>Transferencia</span>
          </MiddleHeaderButton>

          <MiddleHeaderButton
            isActive={activeButton === "qr"}
            isLast
            onClick={() => setActiveButton(activeButton === "qr" ? null : "qr")}
          >
            <FaQrcode />
            <span>Qr - Tarjeta</span>
          </MiddleHeaderButton>
        </MiddleHeaderGroup>
      )}

      {/* DERECHA: Cambio de tema, Menú/Configuración */}
      <HeaderGroup>
        <HeaderItem onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </HeaderItem>
        <HeaderItem isActive={isSettingsOpen} onClick={onSettingsToggle}>
          <FaBars />
        </HeaderItem>
      </HeaderGroup>
    </HeaderContainer>
  );
}
