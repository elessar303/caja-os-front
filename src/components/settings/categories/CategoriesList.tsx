import { useState, useMemo, useContext } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { AppContext } from "../../../context/app";
import type { Category } from "../../../api/categories";
import CategoryModal from "./CategoryModal";
import DeleteConfirmModal from "../products/DeleteConfirmModal";
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
  const { categories } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

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

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    // Aquí implementarías la lógica para guardar la categoría
    // Por ahora solo cerramos el modal
    console.log("Guardar categoría:", categoryData);
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Aquí implementarías la lógica para eliminar la categoría
    console.log("Eliminar categoría:", categoryToDelete);
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
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
    </>
  );
}
