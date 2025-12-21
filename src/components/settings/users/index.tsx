import { useState, useMemo, useContext } from "react";
import { FaEdit, FaTrash, FaShieldAlt, FaDollarSign, FaUser, FaPlus } from "react-icons/fa";
import { AppContext } from "../../../context/app";
import type { User } from "../../../api/users";
import UserModal from "./UserModal";
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
  const { users } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

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
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    console.log("Delete user:", user.id);
    // TODO: Implementar modal de confirmación
  };

  const handleSaveUser = (userData: Partial<User>) => {
    console.log("Saving user:", userData);
    // Lógica para guardar o actualizar el usuario
    setIsUserModalOpen(false);
    setEditingUser(null);
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
                  >
                    <FaEdit
                      style={{ display: "block", width: "14px", height: "14px" }}
                    />
                  </ActionButton>
                  <DeleteButton
                    type="button"
                    onClick={() => handleDeleteUser(user)}
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

      {isUserModalOpen && (
        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => {
            setIsUserModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
          user={editingUser}
        />
      )}
    </UsersContainer>
  );
}

