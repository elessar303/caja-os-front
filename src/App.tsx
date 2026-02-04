import { useState, useContext } from "react";
import { GlobalStyles } from "./styles/globalStyles";

import Header from "./components/layout/header";
import Sidebar from "./components/layout/sidebar";
import MainContent from "./components/layout/main";
import Settings from "./components/settings";
import Login from "./components/login";

import SearchBar from "./components/search/";
import CategoryTabs from "./components/categories";
import ProductGrid from "./components/products";
import { AppContext } from "./context/app";
import SaleConfirmModal from "./components/sales/SaleConfirmModal";
import SaleSuccessModal from "./components/sales/SaleSuccessModal";
import CheckoutModal from "./components/sales/CheckoutModal";
import type { PaymentDetails } from "./api/sales";
import Alert from "./components/common/alert";
import { processSale, getSaleErrorMessage } from "./services/processSale";

export default function App() {
  const {
    isAuthenticated,
    sellProducts,
    clearSellProducts,
    currentUser,
    currentBusiness,
    loadProducts,
    paymentMethods,
  } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<
    "main" | "products" | "stock" | "users" | "paymentMethods"
  >("main");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  // Estados para el proceso de venta
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [completedSale, setCompletedSale] = useState<{
    orderNumber: string;
    total: number;
  } | null>(null);
  const [isProcessingSale, setIsProcessingSale] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Estados para alertas
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <>
        <GlobalStyles />
        <Login />
      </>
    );
  }

  const handleSettingsToggle = () => {
    setIsSettingsOpen(true);
    setSettingsView("main");
  };

  const handleBackToMain = () => {
    if (
      settingsView === "products" ||
      settingsView === "stock" ||
      settingsView === "users" ||
      settingsView === "paymentMethods"
    ) {
      setSettingsView("main");
      setIsSettingsOpen(true); // Mantener settings abierto pero volver a la vista principal
    } else {
      setIsSettingsOpen(false);
      setSettingsView("main");
    }
  };

  const handleHomeClick = () => {
    setIsSettingsOpen(false);
    setSettingsView("main");
  };

  // Calcular el total de la venta
  const calculateSaleTotal = () => {
    return sellProducts.reduce((total, sp) => {
      const price = sp.product.price || 0;
      return total + price * sp.quantity;
    }, 0);
  };

  // Manejar click en método de pago
  const handlePaymentMethodClick = (
    paymentMethodCode: string,
    paymentMethodName: string
  ) => {
    if (sellProducts.length === 0) return;

    setSelectedPaymentMethod({
      code: paymentMethodCode,
      name: paymentMethodName,
    });
    setIsConfirmModalOpen(true);
  };

  // Procesar la venta (cobro directo desde header: 1 método)
  const handleConfirmSale = async () => {
    if (!selectedPaymentMethod || !currentUser || !currentBusiness) {
      setSnackbarMessage("Error: Datos de sesión incompletos");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setIsProcessingSale(true);
    setIsConfirmModalOpen(false);

    try {
      const total = calculateSaleTotal();
      const paymentDetails: PaymentDetails = {
        split: false,
        methods: [{ code: selectedPaymentMethod.code, amount: total }],
      };
      const result = await processSale({
        businessId: currentBusiness.id,
        userId: currentUser.id,
        sellProducts,
        paymentDetails,
      });
      clearSellProducts();
      setCompletedSale(result);
      setIsSuccessModalOpen(true);
      await loadProducts();
    } catch (error) {
      console.error("Error al procesar venta:", error);
      setSnackbarMessage(getSaleErrorMessage(error));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsProcessingSale(false);
      setSelectedPaymentMethod(null);
    }
  };

  // Cerrar modal de confirmación
  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedPaymentMethod(null);
  };

  // Cerrar modal de éxito
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setCompletedSale(null);
  };

  // Abrir modal Finalizar Venta (botón Cobrar)
  const handleCobrarClick = () => {
    if (sellProducts.length > 0) setIsCheckoutModalOpen(true);
  };

  // Completar venta desde modal Finalizar Venta (cobro único o dividido)
  const handleCheckoutConfirm = async (paymentDetails: PaymentDetails) => {
    if (!currentUser || !currentBusiness) {
      setSnackbarMessage("Error: Datos de sesión incompletos");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setIsProcessingSale(true);
    setIsCheckoutModalOpen(false);

    try {
      const result = await processSale({
        businessId: currentBusiness.id,
        userId: currentUser.id,
        sellProducts,
        paymentDetails,
      });
      clearSellProducts();
      setCompletedSale(result);
      setIsSuccessModalOpen(true);
      await loadProducts();
    } catch (error) {
      console.error("Error al procesar venta:", error);
      setSnackbarMessage(getSaleErrorMessage(error));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsProcessingSale(false);
    }
  };

  const handleSettingsNavigation = (
    view: "main" | "products" | "stock" | "users" | "paymentMethods"
  ) => {
    setSettingsView(view);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <>
      <GlobalStyles />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100vw",
          maxWidth: "100vw",
          overflow: "hidden",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <Header
          isSettingsOpen={isSettingsOpen || settingsView !== "main"}
          onSettingsToggle={handleSettingsToggle}
          onBackToMain={handleBackToMain}
          onHomeClick={handleHomeClick}
          onPaymentMethodClick={handlePaymentMethodClick}
          onCobrarClick={handleCobrarClick}
          settingsView={settingsView}
        />

        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            minWidth: 0,
            maxWidth: "100%",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {!isSettingsOpen && <Sidebar />}

          <MainContent>
            {isSettingsOpen || settingsView !== "main" ? (
              <Settings
                onNavigate={handleSettingsNavigation}
                currentView={settingsView}
              />
            ) : (
              <>
                <SearchBar onSearchChange={setSearchTerm} />
                <CategoryTabs onCategoryChange={handleCategoryChange} />
                <ProductGrid
                  searchTerm={searchTerm}
                  selectedCategoryId={selectedCategoryId}
                />
              </>
            )}
          </MainContent>
        </div>

        {/* Modal de Confirmación de Venta */}
        <SaleConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmSale}
          paymentMethodName={selectedPaymentMethod?.name || ""}
          total={calculateSaleTotal()}
          itemsCount={sellProducts.reduce((acc, sp) => acc + sp.quantity, 0)}
        />

        {/* Modal de Venta Exitosa */}
        <SaleSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={handleCloseSuccessModal}
          orderNumber={completedSale?.orderNumber || ""}
          total={completedSale?.total || 0}
        />

        {/* Modal Finalizar Venta (botón Cobrar) */}
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          total={calculateSaleTotal()}
          paymentMethods={paymentMethods}
          onConfirm={handleCheckoutConfirm}
          isProcessing={isProcessingSale}
        />

        {/* Overlay de procesando venta */}
        {isProcessingSale && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <div
              style={{
                background: "white",
                padding: "24px 48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  border: "3px solid #e5e7eb",
                  borderTopColor: "#22c55e",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <span style={{ fontSize: "16px", fontWeight: 500 }}>
                Procesando venta...
              </span>
            </div>
          </div>
        )}

        {/* Alert para mensajes */}
        <Alert
          open={snackbarOpen}
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        />
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
