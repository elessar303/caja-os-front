import { useState, useContext, useEffect } from "react";
import { FaSun, FaMoon, FaWhatsapp } from "react-icons/fa";
import { Alert, Snackbar } from "@mui/material";
import { ThemeContext } from "../../context/theme";
import { AppContext } from "../../context/app";
import { fetchBusinessByName, fetchBusinessById } from "../../api/businesses";
import { authenticateUser } from "../../api/auth";
import LicenseExpiredModal from "./LicenseExpiredModal";
import {
  LoginContainer,
  LoginLeft,
  LoginRight,
  LogoContainer,
  LogoIcon,
  VersionText,
  WelcomeText,
  InstructionText,
  FormContainer,
  InputGroup,
  Label,
  Input,
  CheckboxGroup,
  Checkbox,
  CheckboxLabel,
  ContinueButton,
  ContactButton,
  NewBusinessLink,
  ThemeToggle,
} from "./styled";
import { WHATSAPP_NUMBER } from "../../constants/business";

export default function Login() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { login } = useContext(AppContext);
  const [step, setStep] = useState<"business" | "user">("business");
  const [businessName, setBusinessName] = useState("");
  const [rememberBusiness, setRememberBusiness] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLicenseExpiredModalOpen, setIsLicenseExpiredModalOpen] =
    useState(false);

  // Cargar business guardado si existe
  useEffect(() => {
    const savedBusiness = localStorage.getItem("rememberedBusiness");
    if (savedBusiness) {
      setBusinessName(savedBusiness);
      setRememberBusiness(true);
    }
  }, []);

  const showError = (message: string) => {
    setError(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setError(null);
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const business = await fetchBusinessByName(businessName.trim());

      if (!business) {
        showError(
          "Negocio no encontrado. Verifique el nombre e intente nuevamente."
        );
        setLoading(false);
        return;
      }

      // Validar si la licencia está expirada
      if (business.license_end_date) {
        const licenseEndDate = new Date(business.license_end_date);
        const currentDate = new Date();
        // Comparar solo la fecha (sin hora)
        licenseEndDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        if (licenseEndDate < currentDate) {
          // La licencia está expirada
          setIsLicenseExpiredModalOpen(true);
          setLoading(false);
          return;
        }
      }

      setBusinessId(business.id);
      setStep("user");

      // Guardar business si se marcó "Recordar negocio"
      if (rememberBusiness) {
        localStorage.setItem("rememberedBusiness", businessName.trim());
      } else {
        localStorage.removeItem("rememberedBusiness");
      }
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "Error al buscar el negocio. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!businessId) {
      showError("Error: No se encontró el ID del negocio.");
      setLoading(false);
      return;
    }

    try {
      const user = await authenticateUser(
        businessId,
        username.trim(),
        password
      );

      if (!user) {
        showError(
          "Usuario o contraseña incorrectos. Verifique sus credenciales."
        );
        setLoading(false);
        return;
      }

      // Obtener los datos completos del business
      const business = await fetchBusinessById(businessId);

      if (!business) {
        showError(
          "Error: No se pudo obtener la información del negocio. Intente nuevamente."
        );
        setLoading(false);
        return;
      }

      // Login exitoso - pasar usuario y business
      await login(user, business);
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "Error al autenticar. Intente nuevamente."
      );
      setLoading(false);
    }
  };

  const handleBackToBusiness = () => {
    setStep("business");
    setUsername("");
    setPassword("");
    setError(null);
    setSnackbarOpen(false);
  };

  return (
    <LoginContainer>
      <ThemeToggle onClick={toggleTheme}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </ThemeToggle>

      <LoginLeft>
        <LogoContainer>
          <LogoIcon src="/logo.png" alt="CajaOS Logo" />
          <VersionText>v5.0.0</VersionText>
        </LogoContainer>

        <WelcomeText>Bienvenido</WelcomeText>
        <InstructionText>
          {step === "business"
            ? "Ingrese el código de su negocio"
            : "Ingrese sus credenciales de acceso"}
        </InstructionText>

        <FormContainer>
          {step === "business" ? (
            <form onSubmit={handleBusinessSubmit}>
              <InputGroup>
                <Label htmlFor="businessName">Código de Negocio</Label>
                <Input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ingrese código de negocio"
                  required
                  disabled={loading}
                  autoFocus
                />
              </InputGroup>

              <CheckboxGroup>
                <Checkbox
                  id="rememberBusiness"
                  type="checkbox"
                  checked={rememberBusiness}
                  onChange={(e) => setRememberBusiness(e.target.checked)}
                  disabled={loading}
                />
                <CheckboxLabel htmlFor="rememberBusiness">
                  Recordar negocio
                </CheckboxLabel>
              </CheckboxGroup>

              <ContinueButton type="submit" disabled={loading}>
                {loading ? "Buscando..." : "Continuar"}
              </ContinueButton>
            </form>
          ) : (
            <form onSubmit={handleUserSubmit}>
              <InputGroup>
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su usuario"
                  required
                  disabled={loading}
                  autoFocus
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  required
                  disabled={loading}
                />
              </InputGroup>

              <ContinueButton type="submit" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Continuar"}
              </ContinueButton>

              <ContactButton type="button" onClick={handleBackToBusiness}>
                ← Volver
              </ContactButton>
            </form>
          )}
        </FormContainer>

        {step === "business" && (
          <>
            <ContactButton type="button">
              <FaWhatsapp />
              Contactar proveedor
            </ContactButton>

            <NewBusinessLink>Nuevo negocio →</NewBusinessLink>
          </>
        )}
      </LoginLeft>

      <LoginRight isDarkMode={darkMode} />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <LicenseExpiredModal
        isOpen={isLicenseExpiredModalOpen}
        onClose={() => setIsLicenseExpiredModalOpen(false)}
        whatsappNumber={WHATSAPP_NUMBER}
      />
    </LoginContainer>
  );
}
