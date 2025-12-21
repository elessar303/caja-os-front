import { useState, useEffect } from "react";
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
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [permissions, setPermissions] = useState<UserPermissions>(defaultPermissions);

  useEffect(() => {
    if (user) {
      // Editar usuario existente
      setUsername(user.username);
      setRole(user.role);
      setFullName(user.full_name);
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
    } else {
      // Nuevo usuario - resetear formulario
      setUsername("");
      setRole("cashier");
      setFullName("");
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

  const handleSave = () => {
    // Validación básica
    if (!username || !fullName || (!user && !password)) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    const userData: Partial<User> = {
      id: user?.id || "new-user-id-" + Date.now(),
      business_id: user?.business_id || "d3g7e4c5-0h69-6c9f-d4e7-8a0b1c2d3e4f",
      username,
      role,
      full_name: fullName,
      is_active: isActive,
      permissions: JSON.stringify(permissions),
      email: user?.email || "", // Mantener email existente o vacío
      auth_id: user?.auth_id || null,
      password_hash: user?.password_hash || "", // En producción, hashear la contraseña
      created_at: user?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Si es nuevo usuario y hay contraseña, deberías hashearla aquí
    if (!user && password) {
      // En producción, hashear la contraseña antes de guardar
      userData.password_hash = `$2a$10$hashed_${password}`; // Placeholder
    }

    onSave(userData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <ModalTitle>
              {user ? "Editar Usuario" : "Agregar Usuario"}
            </ModalTitle>
            <ModalSubtitle>
              {user
                ? "Modifique los datos del usuario"
                : "Complete los datos del usuario"}
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
              <Label>Nombre de Usuario</Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
              />
            </FormGroup>
            <FormGroup>
              <Label>Rol</Label>
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
              <Label>Nombre Completo</Label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nombre completo"
              />
            </FormGroup>
            <FormGroup>
              <Label>Contraseña {user && "(dejar vacío para mantener)"}</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={user ? "Nueva contraseña (opcional)" : "Contraseña"}
              />
            </FormGroup>
          </FormRow>

          {/* Tercera línea: Switch para usuario activo */}
          <FormRow>
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
          <SaveButton type="button" onClick={handleSave}>
            <FaSave />
            Guardar
          </SaveButton>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
}

