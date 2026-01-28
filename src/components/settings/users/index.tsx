import { useState, useMemo, useContext } from "react";
import { FaEdit, FaTrash, FaShieldAlt, FaDollarSign, FaUser, FaPlus } from "react-icons/fa";
import { AppContext } from "../../../context/app";
import type { User } from "../../../api/users";
import { createUser, updateUser, deleteUser } from "../../../api/users";
import UserModal from "./UserModal";
import DeleteConfirmModal from "../products/DeleteConfirmModal";
import Alert from "../../common/alert";
import {
  UsersContainer,
  HeaderSection,
  TitleSection,
  Title,
  Description,
  ActionsContainer,
  HeaderActionButton,
  FiltersContainer,
  SearchInput,
  UsersTable,
  TableRow,
  TableCell,
  TableCellFlex,
  UserInfo,
  RoleIcon,
  UserDetails,
  UsernameRow,
  Username,
  RolePill,
  CreatedDate,
  FullName,
  Email,
  StatusPill,
  ActionButtons,
  ActionButton,
  DeleteButton,
} from "./UsersListStyled";

export default function UsersList() {
  const { users, currentUser, loadUsers } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchLower) ||
        user.full_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    );
  }, [users, searchTerm]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <FaShieldAlt />;
      case "cashier":
        return <FaDollarSign />;
      case "mozo":
        return <FaUser />;
      default:
        return <FaUser />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    // Validar que el usuario no sea admin
    if (user.role === "admin") {
      setSnackbarMessage("No se puede editar un usuario con rol administrador");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    // Validar que el usuario no sea admin
    if (user.role === "admin") {
      setSnackbarMessage("No se puede eliminar un usuario con rol administrador");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    if (!currentUser?.business_id) {
      setSnackbarMessage("Error: No hay usuario logueado");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      if (editingUser) {
        // Validar nuevamente que no sea admin antes de editar
        if (editingUser.role === "admin") {
          setSnackbarMessage("No se puede editar un usuario con rol administrador");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          setIsUserModalOpen(false);
          setEditingUser(null);
          return;
        }

        // Editar usuario existente
        if (!userData.id) {
          setSnackbarMessage("Error: ID de usuario no encontrado");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        // Preparar datos para actualizar (excluir campos que no se deben actualizar)
        const updateData: Partial<User> = {
          username: userData.username?.trim(),
          full_name: userData.full_name?.trim(),
          role: userData.role,
          is_active: userData.is_active ?? true,
          permissions: userData.permissions,
          email: userData.email?.trim() || "",
        };

        // Si se proporcionó una nueva contraseña, actualizarla
        if (userData.password_hash && userData.password_hash.trim() !== "") {
          updateData.password_hash = userData.password_hash.trim();
        }

        await updateUser(
          userData.id,
          updateData,
          currentUser.business_id
        );
        setSnackbarMessage("Usuario actualizado exitosamente");
        setSnackbarSeverity("success");
      } else {
        // Crear nuevo usuario
        if (!userData.username || !userData.full_name || !userData.password_hash) {
          setSnackbarMessage("Error: Faltan campos obligatorios (usuario, nombre completo, contraseña)");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        await createUser({
          business_id: currentUser.business_id,
          username: userData.username.trim(),
          full_name: userData.full_name.trim(),
          password_hash: userData.password_hash.trim(),
          role: userData.role || "cashier",
          is_active: userData.is_active ?? true,
          permissions: userData.permissions || "{}",
          email: userData.email?.trim() || "",
          auth_id: null,
        });
        setSnackbarMessage("Usuario creado exitosamente");
        setSnackbarSeverity("success");
      }

      // Recargar la lista de usuarios
      await loadUsers();

      // Cerrar modal
      setIsUserModalOpen(false);
      setEditingUser(null);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving user:", error);
      setSnackbarMessage(
        error instanceof Error ? error.message : "Error al guardar el usuario"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete?.id) {
      setSnackbarMessage("Error: No se pudo identificar el usuario a eliminar");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      return;
    }

    // Validar nuevamente que no sea admin antes de eliminar
    if (userToDelete.role === "admin") {
      setSnackbarMessage("No se puede eliminar un usuario con rol administrador");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      return;
    }

    if (!currentUser?.business_id) {
      setSnackbarMessage("Error: No hay usuario logueado");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      return;
    }

    try {
      await deleteUser(userToDelete.id, currentUser.business_id);

      // Recargar la lista de usuarios
      await loadUsers();

      // Cerrar modal de confirmación
      setIsDeleteModalOpen(false);
      setUserToDelete(null);

      // Mostrar notificación de éxito
      setSnackbarMessage("Usuario eliminado exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbarMessage(
        error instanceof Error ? error.message : "Error al eliminar el usuario"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      // Cerrar modal de confirmación incluso si hay error
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <UsersContainer>
      <HeaderSection>
        <TitleSection>
          <Title>Listado de Usuarios</Title>
          <Description>
            Cantidad registrada: {filteredUsers.length}
          </Description>
        </TitleSection>
        <ActionsContainer>
          <HeaderActionButton type="button" onClick={handleAddUser}>
            <FaPlus style={{ display: "block", width: "14px", height: "14px" }} />
            Agregar
          </HeaderActionButton>
        </ActionsContainer>
      </HeaderSection>

      <FiltersContainer>
        <SearchInput
          type="text"
          placeholder="Buscar por nombre, usuario o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FiltersContainer>

      <UsersTable>
        {filteredUsers.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "var(--text-soft)",
            }}
          >
            No hay usuarios disponibles
          </div>
        ) : (
          filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCellFlex style={{ flex: 2, justifyContent: "flex-start" }}>
                <UserInfo>
                  <RoleIcon>{getRoleIcon(user.role)}</RoleIcon>
                  <UserDetails>
                    <UsernameRow>
                      <Username>{user.username}</Username>
                      <RolePill className={user.role}>{user.role}</RolePill>
                    </UsernameRow>
                    <CreatedDate>
                      Creado: {formatDate(user.created_at)}
                    </CreatedDate>
                  </UserDetails>
                </UserInfo>
              </TableCellFlex>
              <TableCell style={{ flex: 1, justifyContent: "center" }}>
                <FullName>{user.full_name}</FullName>
              </TableCell>
              <TableCell style={{ flex: 1, justifyContent: "center" }}>
                <Email>{user.email}</Email>
              </TableCell>
              <TableCell style={{ flex: 1, justifyContent: "center" }}>
                <StatusPill className={user.is_active ? "active" : "inactive"}>
                  {user.is_active ? "Activo" : "Inactivo"}
                </StatusPill>
              </TableCell>
              <TableCell style={{ flex: 1, justifyContent: "center" }}>
                <ActionButtons>
                  <ActionButton
                    type="button"
                    onClick={() => handleEditUser(user)}
                    disabled={user.role === "admin"}
                    title={user.role === "admin" ? "No se puede editar un usuario administrador" : "Editar usuario"}
                  >
                    <FaEdit
                      style={{ display: "block", width: "14px", height: "14px" }}
                    />
                  </ActionButton>
                  <DeleteButton
                    type="button"
                    onClick={() => handleDeleteUser(user)}
                    disabled={user.role === "admin"}
                    title={user.role === "admin" ? "No se puede eliminar un usuario administrador" : "Eliminar usuario"}
                  >
                    <FaTrash
                      style={{ display: "block", width: "14px", height: "14px" }}
                    />
                  </DeleteButton>
                </ActionButtons>
              </TableCell>
            </TableRow>
          ))
        )}
      </UsersTable>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        user={editingUser}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={userToDelete?.username || ""}
        itemType="user"
      />

      <Alert
        onOpen={snackbarOpen}
        onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </UsersContainer>
  );
}

