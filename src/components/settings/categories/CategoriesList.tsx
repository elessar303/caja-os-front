import { useState, useMemo, useContext } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { AppContext } from "../../../context/app";
import type { Category } from "../../../api/categories";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProductsCount,
} from "../../../api/categories";
import CategoryModal from "./CategoryModal";
import DeleteConfirmModal from "../products/DeleteConfirmModal";
import Alert from "../../common/alert";
import {
  HeaderSection,
  TitleSection,
  Title,
  Description,
  ActionsContainer,
  HeaderActionButton,
  FiltersContainer,
  SearchInput,
  CategoriesTable,
  TableRow,
  TableCell,
  CategoryName,
  ActionButtons,
  ActionButton,
  DeleteButton,
} from "./CategoriesListStyled";

export default function CategoriesList() {
  const { categories, currentUser, loadCategories } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return categories;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchLower)
    );
  }, [categories, searchTerm]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    if (!currentUser?.business_id) {
      setSnackbarMessage("Error: No hay usuario logueado");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      if (editingCategory) {
        // Editar categoría existente
        if (!categoryData.id) {
          setSnackbarMessage("Error: ID de categoría no encontrado");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        await updateCategory(
          categoryData.id,
          { name: categoryData.name?.trim() || "" },
          currentUser.business_id
        );
        setSnackbarMessage("Categoría actualizada exitosamente");
        setSnackbarSeverity("success");
      } else {
        // Crear nueva categoría
        await createCategory({
          business_id: currentUser.business_id,
          name: categoryData.name?.trim() || "",
          color: "#4ade80", // Color por defecto
        });
        setSnackbarMessage("Categoría creada exitosamente");
        setSnackbarSeverity("success");
      }

      // Recargar la lista de categorías
      await loadCategories();

      // Cerrar modal
      setIsModalOpen(false);
      setEditingCategory(null);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving category:", error);
      setSnackbarMessage(
        error instanceof Error ? error.message : "Error al guardar la categoría"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete?.id) {
      setSnackbarMessage(
        "Error: No se pudo identificar la categoría a eliminar"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      return;
    }

    if (!currentUser?.business_id) {
      setSnackbarMessage("Error: No hay usuario logueado");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      return;
    }

    try {
      // Verificar si la categoría tiene productos asociados
      const productsCount = await getCategoryProductsCount(
        categoryToDelete.id,
        currentUser.business_id
      );

      if (productsCount > 0) {
        setSnackbarMessage(
          `No se puede eliminar la categoría porque tiene ${productsCount} producto(s) asociado(s)`
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
        return;
      }

      await deleteCategory(categoryToDelete.id, currentUser.business_id);

      // Recargar la lista de categorías
      await loadCategories();

      // Cerrar modal de confirmación
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);

      // Mostrar notificación de éxito
      setSnackbarMessage("Categoría eliminada exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting category:", error);
      setSnackbarMessage(
        error instanceof Error
          ? error.message
          : "Error al eliminar la categoría"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      // Cerrar modal de confirmación incluso si hay error
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <>
      <HeaderSection>
        <TitleSection>
          <Title>Listado de Categorías</Title>
          <Description>
            Cantidad registrada: {filteredCategories.length}
          </Description>
        </TitleSection>
        <ActionsContainer>
          <HeaderActionButton type="button" onClick={handleAddCategory}>
            <FaPlus
              style={{ display: "block", width: "14px", height: "14px" }}
            />
            Agregar
          </HeaderActionButton>
        </ActionsContainer>
      </HeaderSection>
      <FiltersContainer>
        <SearchInput
          type="text"
          placeholder="Buscar categoría por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FiltersContainer>

      <CategoriesTable>
        {filteredCategories.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "var(--text-soft)",
            }}
          >
            No hay categorías disponibles
          </div>
        ) : (
          filteredCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell style={{ flex: 1 }}>
                <CategoryName>{category.name}</CategoryName>
              </TableCell>
              <TableCell>
                <ActionButtons>
                  <ActionButton
                    type="button"
                    onClick={() => handleEditCategory(category)}
                  >
                    <FaEdit
                      style={{
                        display: "block",
                        width: "14px",
                        height: "14px",
                      }}
                    />
                  </ActionButton>
                  <DeleteButton
                    type="button"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <FaTrash
                      style={{
                        display: "block",
                        width: "14px",
                        height: "14px",
                      }}
                    />
                  </DeleteButton>
                </ActionButtons>
              </TableCell>
            </TableRow>
          ))
        )}
      </CategoriesTable>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={categoryToDelete?.name || ""}
        itemType="category"
      />
      <Alert
        onOpen={snackbarOpen}
        onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </>
  );
}
