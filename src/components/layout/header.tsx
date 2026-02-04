import { useContext, useState, useMemo } from "react";
import {
  FaSync,
  FaSun,
  FaBars,
  FaMoon,
  FaTag,
  FaTable,
  FaShoppingCart,
  FaCashRegister,
  FaArrowLeft,
  FaSignOutAlt,
  FaHome,
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
import { getPaymentMethodIcon } from "../../components/settings/paymentMethods/utils/iconMapper";

interface HeaderProps {
  isSettingsOpen: boolean;
  onSettingsToggle: () => void;
  onBackToMain: () => void;
  onHomeClick: () => void;
  onPaymentMethodClick?: (
    paymentMethodCode: string,
    paymentMethodName: string
  ) => void;
  onCobrarClick?: () => void;
  settingsView?: "main" | "products" | "stock" | "users" | "paymentMethods";
}

export default function Header({
  isSettingsOpen,
  onSettingsToggle,
  onBackToMain,
  onHomeClick,
  onPaymentMethodClick,
  onCobrarClick,
  settingsView = "main",
}: HeaderProps) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { sellProducts, logout, paymentMethods } = useContext(AppContext);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const canCharge = sellProducts.length > 0;

  // Obtener métodos de pago activos ordenados por display_order
  const activePaymentMethods = useMemo(() => {
    return paymentMethods
      .filter((pm) => pm.is_active)
      .sort((a, b) => a.display_order - b.display_order);
  }, [paymentMethods]);

  const handleLogout = () => {
    const confirmed = window.confirm("¿Está seguro que desea cerrar sesión?");
    if (confirmed) {
      logout();
    }
  };

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
          <HeaderItem onClick={onHomeClick}>
            <FaHome color="#22c55e" />
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
            {settingsView === "paymentMethods" && (
              <>
                <BreadcrumbSeparator> / </BreadcrumbSeparator>
                <BreadcrumbItem isActive>Métodos de Pago</BreadcrumbItem>
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
                onCobrarClick?.();
              }
            }}
          >
            <FaCashRegister />
            <span>COBRAR</span>
          </MiddleHeaderButton>

          {activePaymentMethods.map((paymentMethod, index) => (
            <MiddleHeaderButton
              key={paymentMethod.id}
              isActive={activeButton === `payment-${paymentMethod.id}`}
              isLast={index === activePaymentMethods.length - 1}
              disabled={!canCharge}
              onClick={() => {
                if (canCharge && onPaymentMethodClick) {
                  onPaymentMethodClick(paymentMethod.code, paymentMethod.name);
                }
              }}
              $paymentColor={paymentMethod.color}
            >
              {getPaymentMethodIcon(paymentMethod.icon)}
              <span>{paymentMethod.name}</span>
            </MiddleHeaderButton>
          ))}
        </MiddleHeaderGroup>
      )}

      {/* DERECHA: Cambio de tema, Menú/Configuración, Logout */}
      <HeaderGroup>
        <HeaderItem onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </HeaderItem>
        <HeaderItem isActive={isSettingsOpen} onClick={onSettingsToggle}>
          <FaBars />
        </HeaderItem>
        <HeaderItem onClick={handleLogout}>
          <FaSignOutAlt color="#ef4444" />
        </HeaderItem>
      </HeaderGroup>
    </HeaderContainer>
  );
}
