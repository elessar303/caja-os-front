import { useState, useEffect, useContext } from "react";
import { FaTrash, FaPlus, FaGripVertical } from "react-icons/fa";
import { AppContext } from "../../../context/app";
import type { PaymentMethod } from "../../../api/paymentMethods";
import {
  fetchPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../../../api/paymentMethods";
import DeleteConfirmModal from "../products/DeleteConfirmModal";
import Alert from "../../common/alert";
import PaymentMethodModal from "./PaymentMethodModal";
import { getPaymentMethodIcon } from "../../../utils/iconMapper";
import {
  PaymentMethodsContainer,
  HeaderSection,
  TitleSection,
  Title,
  Description,
  ActionsContainer,
  HeaderActionButton,
  PaymentMethodsList as StyledList,
  PaymentMethodItem,
  DragHandle,
  IconContainer,
  PaymentMethodInfo,
  PaymentMethodName,
  PaymentMethodCode,
  StatusPill,
  ToggleContainer,
  ToggleSwitch,
  ActionButtons,
  DeleteButton,
} from "./PaymentMethodsListStyled";

export default function PaymentMethodsList() {
  const {
    currentUser,
    paymentMethods: contextPaymentMethods,
    loadPaymentMethods: loadContextPaymentMethods,
  } = useContext(AppContext);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] =
    useState<PaymentMethod | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [draggedItem, setDraggedItem] = useState<PaymentMethod | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  const loadLocalPaymentMethods = async () => {
    if (!currentUser?.business_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchPaymentMethods(currentUser.business_id);
      setPaymentMethods(data);
    } catch (error) {
      console.error("Error loading payment methods:", error);
      setSnackbarMessage(
        error instanceof Error
          ? error.message
          : "Error al cargar los métodos de pago"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocalPaymentMethods();
  }, [currentUser?.business_id]);

  // Sincronizar con el context cuando cambie
  useEffect(() => {
    if (contextPaymentMethods.length > 0) {
      setPaymentMethods(contextPaymentMethods);
    }
  }, [contextPaymentMethods]);

  const handleToggleActive = async (paymentMethod: PaymentMethod) => {
    if (!currentUser?.business_id) {
      setSnackbarMessage("Error: No hay usuario logueado");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      await updatePaymentMethod(
        paymentMethod.id,
        { is_active: !paymentMethod.is_active },
        currentUser.business_id
      );
      await loadLocalPaymentMethods();
      await loadContextPaymentMethods();
      setSnackbarMessage(
        `Método de pago ${
          !paymentMethod.is_active ? "activado" : "desactivado"
        } exitosamente`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating payment method:", error);
      setSnackbarMessage(
        error instanceof Error
          ? error.message
          : "Error al actualizar el método de pago"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeletePaymentMethod = (paymentMethod: PaymentMethod) => {
    if (paymentMethod.is_system) {
      setSnackbarMessage("No se puede eliminar un método de pago del sistema");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setPaymentMethodToDelete(paymentMethod);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!paymentMethodToDelete?.id || !currentUser?.business_id) {
      setSnackbarMessage("Error: No se pudo identificar el método de pago");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsDeleteModalOpen(false);
      setPaymentMethodToDelete(null);
      return;
    }

    try {
      await deletePaymentMethod(
        paymentMethodToDelete.id,
        currentUser.business_id
      );
      await loadLocalPaymentMethods();
      await loadContextPaymentMethods();
      setIsDeleteModalOpen(false);
      setPaymentMethodToDelete(null);
      setSnackbarMessage("Método de pago eliminado exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting payment method:", error);
      setSnackbarMessage(
        error instanceof Error
          ? error.message
          : "Error al eliminar el método de pago"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsDeleteModalOpen(false);
      setPaymentMethodToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPaymentMethodToDelete(null);
  };

  const handleAddPaymentMethod = () => {
    setEditingPaymentMethod(null);
    setIsModalOpen(true);
  };

  const handleSavePaymentMethod = async (
    paymentMethodData: Partial<PaymentMethod>
  ) => {
    if (!currentUser?.business_id) {
      setSnackbarMessage("Error: No hay usuario logueado");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      // Normalizar el código a minúsculas para validación
      const normalizedCode = paymentMethodData.code?.trim().toLowerCase() || "";

      if (editingPaymentMethod) {
        // Editar método de pago existente
        if (!paymentMethodData.id) {
          setSnackbarMessage("Error: ID de método de pago no encontrado");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        // Validar que el código no esté duplicado (excepto el actual)
        const codeExists = paymentMethods.some(
          (pm) =>
            pm.id !== editingPaymentMethod.id &&
            pm.code.toLowerCase() === normalizedCode
        );

        if (codeExists) {
          setSnackbarMessage(
            `Error: Ya existe un método de pago con el código "${normalizedCode}"`
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        await updatePaymentMethod(
          paymentMethodData.id,
          {
            name: paymentMethodData.name?.trim(),
            code: normalizedCode,
            icon: paymentMethodData.icon,
            color: paymentMethodData.color,
          },
          currentUser.business_id
        );
        setSnackbarMessage("Método de pago actualizado exitosamente");
        setSnackbarSeverity("success");
      } else {
        // Crear nuevo método de pago
        if (
          !paymentMethodData.name ||
          !paymentMethodData.code ||
          !paymentMethodData.icon ||
          !paymentMethodData.color
        ) {
          setSnackbarMessage(
            "Error: Faltan campos obligatorios (nombre, código, icono, color)"
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        // Validar que el código no esté duplicado
        const codeExists = paymentMethods.some(
          (pm) => pm.code.toLowerCase() === normalizedCode
        );

        if (codeExists) {
          setSnackbarMessage(
            `Error: Ya existe un método de pago con el código "${normalizedCode}"`
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        // Obtener el máximo display_order y agregar 1 para el nuevo método
        const maxDisplayOrder =
          paymentMethods.length > 0
            ? Math.max(...paymentMethods.map((pm) => pm.display_order))
            : -1;

        await createPaymentMethod({
          business_id: currentUser.business_id,
          name: paymentMethodData.name.trim(),
          code: normalizedCode,
          icon: paymentMethodData.icon,
          color: paymentMethodData.color,
          is_active: paymentMethodData.is_active ?? true,
          is_system: false,
          display_order: maxDisplayOrder + 1,
        });
        setSnackbarMessage("Método de pago creado exitosamente");
        setSnackbarSeverity("success");
      }

      // Recargar la lista de métodos de pago y actualizar el context
      await loadLocalPaymentMethods();
      await loadContextPaymentMethods();

      // Cerrar modal
      setIsModalOpen(false);
      setEditingPaymentMethod(null);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving payment method:", error);
      setSnackbarMessage(
        error instanceof Error
          ? error.message
          : "Error al guardar el método de pago"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDragStart = (
    e: React.DragEvent,
    paymentMethod: PaymentMethod
  ) => {
    setDraggedItem(paymentMethod);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", paymentMethod.id);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDraggedOverIndex(index);
  };

  const handleDragLeave = () => {
    setDraggedOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDraggedOverIndex(null);

    if (!draggedItem || !currentUser?.business_id) {
      return;
    }

    const draggedIndex = paymentMethods.findIndex(
      (pm) => pm.id === draggedItem.id
    );

    if (draggedIndex === dropIndex) {
      setDraggedItem(null);
      return;
    }

    // Crear nuevo array con el orden actualizado
    const newPaymentMethods = [...paymentMethods];
    const [removed] = newPaymentMethods.splice(draggedIndex, 1);
    newPaymentMethods.splice(dropIndex, 0, removed);

    // Actualizar display_order del 1 al n
    const updatedPaymentMethods = newPaymentMethods.map((pm, index) => ({
      ...pm,
      display_order: index + 1,
    }));

    try {
      // Actualizar todos los métodos de pago con su nuevo display_order
      await Promise.all(
        updatedPaymentMethods.map((pm) =>
          updatePaymentMethod(
            pm.id,
            { display_order: pm.display_order },
            currentUser.business_id
          )
        )
      );

      // Actualizar el estado local
      setPaymentMethods(updatedPaymentMethods);
      setDraggedItem(null);

      // Actualizar el context
      await loadContextPaymentMethods();

      // Mostrar mensaje de éxito
      setSnackbarMessage("Orden de métodos de pago actualizado correctamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating payment methods order:", error);
      setSnackbarMessage(
        error instanceof Error
          ? error.message
          : "Error al actualizar el orden de los métodos de pago"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      // Recargar la lista original en caso de error
      await loadLocalPaymentMethods();
      await loadContextPaymentMethods();
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedOverIndex(null);
  };

  if (loading) {
    return (
      <PaymentMethodsContainer>
        <div style={{ padding: "20px", textAlign: "center" }}>
          Cargando métodos de pago...
        </div>
      </PaymentMethodsContainer>
    );
  }

  return (
    <PaymentMethodsContainer>
      <HeaderSection>
        <TitleSection>
          <Title>Métodos de Pago</Title>
          <Description>
            Cantidad registrada: {paymentMethods.length}
          </Description>
        </TitleSection>
        <ActionsContainer>
          <HeaderActionButton type="button" onClick={handleAddPaymentMethod}>
            <FaPlus
              style={{ display: "block", width: "14px", height: "14px" }}
            />
            Agregar
          </HeaderActionButton>
        </ActionsContainer>
      </HeaderSection>

      <StyledList>
        {paymentMethods.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "var(--text-soft)",
            }}
          >
            No hay métodos de pago disponibles
          </div>
        ) : (
          paymentMethods.map((paymentMethod, index) => (
            <PaymentMethodItem
              key={paymentMethod.id}
              draggable
              onDragStart={(e) => handleDragStart(e, paymentMethod)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              $isDragging={draggedItem?.id === paymentMethod.id}
              $isDragOver={draggedOverIndex === index}
            >
              <DragHandle>
                <FaGripVertical />
              </DragHandle>
              <IconContainer $color={paymentMethod.color}>
                {getPaymentMethodIcon(paymentMethod.icon)}
              </IconContainer>
              <PaymentMethodInfo>
                <PaymentMethodName>{paymentMethod.name}</PaymentMethodName>
                <PaymentMethodCode>
                  {paymentMethod.code}
                  {paymentMethod.is_system && (
                    <span style={{ marginLeft: "4px", color: "#10b981" }}>
                      (Sistema)
                    </span>
                  )}
                </PaymentMethodCode>
              </PaymentMethodInfo>
              <StatusPill
                className={paymentMethod.is_active ? "active" : "inactive"}
              >
                {paymentMethod.is_active ? "Activo" : "Inactivo"}
              </StatusPill>
              <ToggleContainer>
                <ToggleSwitch
                  type="checkbox"
                  checked={paymentMethod.is_active}
                  onChange={() => handleToggleActive(paymentMethod)}
                />
              </ToggleContainer>
              {!paymentMethod.is_system && (
                <ActionButtons>
                  <DeleteButton
                    type="button"
                    onClick={() => handleDeletePaymentMethod(paymentMethod)}
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
              )}
            </PaymentMethodItem>
          ))
        )}
      </StyledList>

      <PaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPaymentMethod(null);
        }}
        onSave={handleSavePaymentMethod}
        paymentMethod={editingPaymentMethod}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={paymentMethodToDelete?.name || ""}
        itemType="paymentMethod"
      />

      <Alert
        onOpen={snackbarOpen}
        onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </PaymentMethodsContainer>
  );
}
