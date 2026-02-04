import type { CSSProperties } from "react";
import { useContext, useState, useMemo, useEffect, useRef } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";
import { ThemeContext } from "../../context/theme";
import type { PaymentMethod } from "../../api/paymentMethods";
import type { PaymentDetails } from "../../api/sales";
import { getPaymentMethodIcon } from "../settings/paymentMethods/utils/iconMapper";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  HeaderRow,
  ModalTitle,
  ModalSubtitle,
  CloseButton,
  ModalBody,
  SummarySection,
  TotalRow,
  Label,
  TotalAmount,
  InputRow,
  InputWithButtonRow,
  MontoTotalButton,
  InputLabel,
  Input,
  ChangeAmount,
  Section,
  SectionHeader,
  SectionTitle,
  CheckboxLabel,
  Checkbox,
  RadioGroup,
  RadioOption,
  RadioInput,
  SplitMethods,
  SplitMethodRow,
  SplitMethodLabel,
  SplitRow,
  DropdownWrapper,
  DropdownTrigger,
  DropdownList,
  DropdownOption,
  AmountInput,
  TotalEntered,
  OptionsGroup,
  ModalFooter,
  ButtonContent,
  CancelButton,
  ConfirmButton,
  ConfirmIcon,
  PrecuentaButton,
} from "./CheckoutModalStyled";

const SPLIT_SLOTS = 2;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  paymentMethods: PaymentMethod[];
  onConfirm: (paymentDetails: PaymentDetails) => void;
  isProcessing?: boolean;
}

interface SplitSlot {
  methodCode: string;
  amount: string;
}

/**
 * Deja solo dígitos y un punto decimal con hasta 2 decimales (regex: ^\d*\.?\d{0,2}$).
 */
function sanitizeAmountInput(value: string): string {
  const onlyNumbersAndDot = value.replace(/[^\d.]/g, "");
  const parts = onlyNumbersAndDot.split(".");
  if (parts.length === 1) return parts[0];
  const integerPart = parts[0] ?? "";
  const decimalPart = (parts[1] ?? "").replace(/\D/g, "").slice(0, 2);
  return decimalPart.length > 0
    ? `${integerPart}.${decimalPart}`
    : `${integerPart}.`;
}

function parseAmount(value: string): number {
  const n = parseFloat(value.replace(",", ".")) || 0;
  return Math.round(n * 100) / 100;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  total,
  paymentMethods,
  onConfirm,
  isProcessing = false,
}: CheckoutModalProps) {
  const { darkMode } = useContext(ThemeContext);

  const activeMethods = useMemo(
    () =>
      paymentMethods
        .filter((pm) => pm.is_active)
        .sort((a, b) => a.display_order - b.display_order),
    [paymentMethods]
  );

  const [splitPayment, setSplitPayment] = useState(false);
  const [selectedMethodCode, setSelectedMethodCode] = useState<string>(
    activeMethods[0]?.code ?? ""
  );
  const [amountReceived, setAmountReceived] = useState("");
  const [splitSlots, setSplitSlots] = useState<SplitSlot[]>(() =>
    Array(SPLIT_SLOTS)
      .fill(null)
      .map((_, i) => ({
        methodCode: activeMethods[i]?.code ?? activeMethods[0]?.code ?? "",
        amount: "",
      }))
  );
  const [printTicket, setPrintTicket] = useState(false);
  const [printInvoice, setPrintInvoice] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const openRef =
        openDropdownIndex !== null
          ? dropdownRefs.current[openDropdownIndex]
          : null;
      if (openRef && !openRef.contains(e.target as Node)) {
        setOpenDropdownIndex(null);
      }
    };
    if (openDropdownIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openDropdownIndex]);

  useEffect(() => {
    if (isOpen && activeMethods.length) {
      setSplitPayment(false);
      setAmountReceived("");
      setSelectedMethodCode(activeMethods[0].code);
      setSplitSlots(
        Array(SPLIT_SLOTS)
          .fill(null)
          .map((_, i) => ({
            methodCode: activeMethods[i]?.code ?? activeMethods[0].code,
            amount: "",
          }))
      );
    }
  }, [isOpen, activeMethods]);

  if (!isOpen) return null;

  const amountReceivedNum = parseAmount(amountReceived);
  const change = amountReceivedNum - total;
  const singleValid = amountReceivedNum >= total && selectedMethodCode;

  const splitTotalEntered = splitSlots.reduce(
    (sum, s) => sum + parseAmount(s.amount),
    0
  );
  const splitValid =
    splitTotalEntered >= total &&
    splitSlots.every((s) => s.methodCode && parseAmount(s.amount) > 0);

  const canComplete = splitPayment ? splitValid : singleValid;

  const handleConfirm = () => {
    if (!canComplete) return;

    if (splitPayment) {
      const methods = splitSlots
        .filter((s) => s.methodCode && parseAmount(s.amount) > 0)
        .map((s) => ({
          code: s.methodCode,
          amount: parseAmount(s.amount),
        }));
      if (methods.length === 0) return;
      onConfirm({ split: true, methods });
    } else {
      onConfirm({
        split: false,
        methods: [{ code: selectedMethodCode, amount: total }],
      });
    }
  };

  const updateSplitSlot = (
    index: number,
    field: keyof SplitSlot,
    value: string
  ) => {
    setSplitSlots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  return (
    <ModalOverlay>
      <ModalContainer $darkMode={darkMode}>
        <ModalHeader>
          <HeaderRow>
            <div>
              <ModalTitle>Finalizar Venta</ModalTitle>
              <ModalSubtitle>
                Seleccione el método de pago y opciones de impresión
              </ModalSubtitle>
            </div>
            <CloseButton onClick={onClose} type="button">
              <FaTimes />
            </CloseButton>
          </HeaderRow>
        </ModalHeader>

        <ModalBody>
          <SummarySection>
            <TotalRow>
              <Label>Total a pagar:</Label>
              <TotalAmount>${total.toFixed(2)}</TotalAmount>
            </TotalRow>

            {!splitPayment && (
              <>
                <InputRow>
                  <InputLabel htmlFor="amount-received">
                    Monto recibido:
                  </InputLabel>
                  <InputWithButtonRow>
                    <Input
                      id="amount-received"
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amountReceived}
                      onChange={(e) =>
                        setAmountReceived(sanitizeAmountInput(e.target.value))
                      }
                    />
                    <MontoTotalButton
                      type="button"
                      onClick={() => setAmountReceived(total.toFixed(2))}
                    >
                      Monto Total
                    </MontoTotalButton>
                  </InputWithButtonRow>
                </InputRow>
                <TotalRow>
                  <Label>Cambio:</Label>
                  <ChangeAmount $valid={change >= 0}>
                    ${Math.max(0, change).toFixed(2)}
                  </ChangeAmount>
                </TotalRow>
              </>
            )}
          </SummarySection>

          <Section>
            <SectionHeader>
              <SectionTitle>Método de Pago</SectionTitle>
              <CheckboxLabel>
                <Checkbox
                  checked={splitPayment}
                  onChange={(e) => setSplitPayment(e.target.checked)}
                />
                Dividir Pago
              </CheckboxLabel>
            </SectionHeader>

            {!splitPayment ? (
              <RadioGroup>
                {activeMethods.map((pm) => (
                  <RadioOption
                    key={pm.id}
                    $selected={selectedMethodCode === pm.code}
                    style={
                      {
                        "--radio-color": pm.color,
                        "--radio-bg": `${pm.color}20`,
                      } as CSSProperties
                    }
                  >
                    <RadioInput
                      name="payment-method"
                      checked={selectedMethodCode === pm.code}
                      onChange={() => setSelectedMethodCode(pm.code)}
                    />
                    <span className="radio-icon">
                      {getPaymentMethodIcon(pm.icon)}
                    </span>
                    <span className="radio-text">{pm.name}</span>
                  </RadioOption>
                ))}
              </RadioGroup>
            ) : (
              <SplitMethods>
                {splitSlots.map((slot, index) => {
                  const selectedMethod = activeMethods.find(
                    (pm) => pm.code === slot.methodCode
                  );
                  return (
                    <SplitMethodRow key={index}>
                      <SplitMethodLabel>Método {index + 1}</SplitMethodLabel>
                      <SplitRow>
                        <DropdownWrapper
                          ref={(el) => {
                            dropdownRefs.current[index] = el;
                          }}
                        >
                          <DropdownTrigger
                            type="button"
                            onClick={() =>
                              setOpenDropdownIndex(
                                openDropdownIndex === index ? null : index
                              )
                            }
                            style={
                              {
                                "--trigger-color":
                                  selectedMethod?.color ?? undefined,
                              } as CSSProperties
                            }
                          >
                            <span className="dropdown-icon">
                              {selectedMethod
                                ? getPaymentMethodIcon(selectedMethod.icon)
                                : null}
                            </span>
                            <span className="dropdown-text">
                              {selectedMethod?.name ?? "Seleccionar"}
                            </span>
                          </DropdownTrigger>
                          {openDropdownIndex === index && (
                            <DropdownList>
                              {activeMethods.map((pm) => (
                                <DropdownOption
                                  key={pm.id}
                                  type="button"
                                  onClick={() => {
                                    updateSplitSlot(
                                      index,
                                      "methodCode",
                                      pm.code
                                    );
                                    setOpenDropdownIndex(null);
                                  }}
                                  style={
                                    {
                                      "--option-color": pm.color,
                                    } as CSSProperties
                                  }
                                >
                                  <span className="option-icon">
                                    {getPaymentMethodIcon(pm.icon)}
                                  </span>
                                  <span className="option-text">{pm.name}</span>
                                </DropdownOption>
                              ))}
                            </DropdownList>
                          )}
                        </DropdownWrapper>
                        <AmountInput
                          type="text"
                          inputMode="decimal"
                          placeholder="Monto"
                          value={slot.amount}
                          onChange={(e) =>
                            updateSplitSlot(
                              index,
                              "amount",
                              sanitizeAmountInput(e.target.value)
                            )
                          }
                        />
                      </SplitRow>
                    </SplitMethodRow>
                  );
                })}
                <TotalRow>
                  <Label>Total ingresado:</Label>
                  <TotalEntered $valid={splitTotalEntered >= total}>
                    ${splitTotalEntered.toFixed(2)} / ${total.toFixed(2)}
                  </TotalEntered>
                </TotalRow>
              </SplitMethods>
            )}
          </Section>

          <Section>
            <SectionTitle>Opciones</SectionTitle>
            <OptionsGroup>
              <CheckboxLabel>
                <Checkbox
                  checked={printTicket}
                  onChange={(e) => setPrintTicket(e.target.checked)}
                />
                Imprimir ticket
              </CheckboxLabel>
              <CheckboxLabel>
                <Checkbox
                  checked={printInvoice}
                  onChange={(e) => setPrintInvoice(e.target.checked)}
                />
                Generar e imprimir factura
              </CheckboxLabel>
              <PrecuentaButton type="button" disabled>
                Imprimir Precuenta
              </PrecuentaButton>
            </OptionsGroup>
          </Section>
        </ModalBody>

        <ModalFooter>
          <CancelButton type="button" onClick={onClose}>
            <ButtonContent>
              <FaTimes />
              <span>Cancelar</span>
            </ButtonContent>
          </CancelButton>
          <ConfirmButton
            type="button"
            $disabled={!canComplete || isProcessing}
            disabled={!canComplete || isProcessing}
            onClick={handleConfirm}
          >
            <ButtonContent>
              <ConfirmIcon>
                <FaCheck />
              </ConfirmIcon>
              <span>Completar Venta</span>
            </ButtonContent>
          </ConfirmButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
}
