import { useState, useEffect, useMemo } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import type { User } from "../../../api/users";
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
  SwitchContainer,
  Switch,
  SwitchLabel,
  PermissionsSection,
  PermissionsTitle,
  PermissionItem,
  PermissionLabel,
  ButtonGroup,
  CancelButton,
  SaveButton,
} from "./UserModalStyled";

interface UserPermissions {
  canLockTables: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canDeleteOrders: boolean;
  canManageTables: boolean;
  canModifyPrices: boolean;
  canApplyDiscounts: boolean;
  canManageProducts: boolean;
  canCloseCashRegister: boolean;
  canViewClosingHistory: boolean;
  canAddProductsToTables: boolean;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  user?: User | null;
}

const defaultPermissions: UserPermissions = {
  canLockTables: false,
  canManageUsers: false,
  canViewReports: false,
  canDeleteOrders: false,
  canManageTables: false,
  canModifyPrices: false,
  canApplyDiscounts: false,
  canManageProducts: false,
  canCloseCashRegister: false,
  canViewClosingHistory: false,
  canAddProductsToTables: false,
};

const permissionLabels: Record<keyof UserPermissions, string> = {
  canLockTables: "Bloquear Mesas",
  canManageUsers: "Gestionar Usuarios",
  canViewReports: "Ver Reportes",
  canDeleteOrders: "Eliminar Pedidos",
  canManageTables: "Gestionar Mesas",
  canModifyPrices: "Modificar Precios",
  canApplyDiscounts: "Aplicar Descuentos",
  canManageProducts: "Gestionar Productos",
  canCloseCashRegister: "Cerrar Caja",
  canViewClosingHistory: "Ver Historial de Cierres",
  canAddProductsToTables: "Agregar Productos a Mesas",
};

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  user,
}: UserModalProps) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"admin" | "cashier" | "mozo">("cashier");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [permissions, setPermissions] = useState<UserPermissions>(defaultPermissions);

  useEffect(() => {
    if (user && isOpen) {
      // Editar usuario existente
      setUsername(user.username);
      setRole(user.role);
      setFullName(user.full_name);
      setEmail(user.email || "");
      setPassword(""); // No mostrar contraseña existente
      setIsActive(user.is_active);

      // Parsear permissions
      try {
        const parsedPermissions = JSON.parse(user.permissions) as UserPermissions;
        setPermissions(parsedPermissions);
      } catch (error) {
        console.error("Error parsing permissions:", error);
        setPermissions(defaultPermissions);
      }
    } else if (isOpen) {
      // Nuevo usuario - resetear formulario
      setUsername("");
      setRole("cashier");
      setFullName("");
      setEmail("");
      setPassword("");
      setIsActive(true);
      setPermissions(defaultPermissions);
    }
  }, [isOpen, user]);

  const handlePermissionChange = (key: keyof UserPermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Validar formulario - campos obligatorios
  const isFormValid = useMemo(() => {
    const hasRequiredFields = username.trim().length > 0 && fullName.trim().length > 0;
    // Contraseña solo es obligatoria para nuevos usuarios
    const hasPassword = user ? true : password.trim().length > 0;
    return hasRequiredFields && hasPassword;
  }, [username, fullName, password, user]);

  const handleSave = () => {
    if (!isFormValid) {
      return;
    }

    const userData: Partial<User> = {
      id: user?.id,
      business_id: user?.business_id || "",
      username: username.trim(),
      role,
      full_name: fullName.trim(),
      email: email.trim(),
      is_active: isActive,
      permissions: JSON.stringify(permissions),
      auth_id: user?.auth_id || null,
      password_hash: user?.password_hash || "", // Se establecerá después
    };

    // Si es nuevo usuario, la contraseña es obligatoria
    // Si es edición y hay nueva contraseña, actualizarla
    if (!user) {
      // Nuevo usuario: usar la contraseña ingresada directamente
      // NOTA: En producción, deberías hashear la contraseña antes de guardar
      userData.password_hash = password.trim();
    } else if (password.trim() !== "") {
      // Edición con nueva contraseña: actualizar
      // NOTA: En producción, deberías hashear la contraseña antes de guardar
      userData.password_hash = password.trim();
    }
    // Si es edición sin nueva contraseña, password_hash se mantiene del usuario existente

    onSave(userData);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <ModalTitle>
              {user ? "Editar Usuario" : "Agregar Usuario"}
            </ModalTitle>
            <ModalSubtitle>
              {user
                ? "Modifique los datos del usuario"
                : "Complete los datos del usuario. Los campos marcados con "}
              {!user && <span style={{ color: "#ef4444" }}>*</span>}
              {!user && " son obligatorios"}
            </ModalSubtitle>
          </div>
          <CloseButton onClick={onClose} type="button">
            <FaTimes style={{ color: "inherit !important", flexShrink: 0 }} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Primera línea: Nombre de usuario y Rol */}
          <FormRow>
            <FormGroup>
              <Label>
                Nombre de Usuario <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
              />
            </FormGroup>
            <FormGroup>
              <Label>
                Rol <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Select value={role} onChange={(e) => setRole(e.target.value as "admin" | "cashier" | "mozo")}>
                <option value="admin">Admin</option>
                <option value="cashier">Cashier</option>
                <option value="mozo">Mozo</option>
              </Select>
            </FormGroup>
          </FormRow>

          {/* Segunda línea: Nombre completo y Contraseña */}
          <FormRow>
            <FormGroup>
              <Label>
                Nombre Completo <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nombre completo"
              />
            </FormGroup>
            <FormGroup>
              <Label>
                Contraseña{" "}
                {user ? (
                  <span style={{ fontSize: "12px", color: "var(--text-soft)" }}>
                    (dejar vacío para mantener)
                  </span>
                ) : (
                  <span style={{ color: "#ef4444" }}>*</span>
                )}
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={user ? "Nueva contraseña (opcional)" : "Contraseña"}
              />
            </FormGroup>
          </FormRow>

          {/* Tercera línea: Email y Switch para usuario activo */}
          <FormRow>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </FormGroup>
            <FormGroup>
              <SwitchContainer>
                <Switch
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  id="isActive"
                />
                <SwitchLabel htmlFor="isActive">Usuario Activo</SwitchLabel>
              </SwitchContainer>
            </FormGroup>
          </FormRow>

          {/* Permisos */}
          <PermissionsSection>
            <PermissionsTitle>Permisos</PermissionsTitle>
            {(Object.keys(permissions) as Array<keyof UserPermissions>).map(
              (key) => (
                <PermissionItem key={key}>
                  <PermissionLabel htmlFor={`permission-${key}`}>
                    {permissionLabels[key]}
                  </PermissionLabel>
                  <SwitchContainer>
                    <Switch
                      type="checkbox"
                      checked={permissions[key]}
                      onChange={() => handlePermissionChange(key)}
                      id={`permission-${key}`}
                    />
                  </SwitchContainer>
                </PermissionItem>
              )
            )}
          </PermissionsSection>
        </ModalBody>

        <ButtonGroup>
          <CancelButton type="button" onClick={onClose}>
            Cancelar
          </CancelButton>
          <SaveButton type="button" onClick={handleSave} disabled={!isFormValid}>
            <FaSave />
            Guardar
          </SaveButton>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
}

