import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

interface ModalContainerProps {
  $darkMode?: boolean;
}

export const ModalContainer = styled.div<ModalContainerProps>`
  background: ${({ theme }) => theme.background};
  border-radius: 12px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadow.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const ModalSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.textSoft};
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSoft};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.colors.bgHover};
  }

  svg {
    font-size: 18px;
  }
`;

export const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SummarySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TotalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Label = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

export const TotalAmount = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InputWithButtonRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: stretch;

  input {
    flex: 1;
    min-width: 0;
  }
`;

export const MontoTotalButton = styled.button`
  flex-shrink: 0;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  background: ${({ theme }) => theme.colors.greenSoft};
  border: 1px solid ${({ theme }) => theme.colors.greenBorder};
  color: ${({ theme }) => theme.colors.greenBorder};

  &:hover {
    background: ${({ theme }) => theme.colors.greenBorder};
    color: ${({ theme }) => theme.background};
  }
`;

export const InputLabel = styled.label`
  font-size: 13px;
  color: ${({ theme }) => theme.textSoft};
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.greenBorder};
  }
`;

export const ChangeAmount = styled.span<{ $valid?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ $valid, theme }) =>
    $valid ? theme.colors.success : theme.colors.danger};
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;

export const SectionTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  user-select: none;
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.greenBorder};
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface RadioOptionProps {
  $color?: string;
  $selected?: boolean;
}

export const RadioOption = styled.label<RadioOptionProps>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected
        ? `var(--radio-color, ${theme.colors.greenBorder})`
        : theme.colors.border};
  background: ${({ $selected, theme }) =>
    $selected ? `var(--radio-bg, ${theme.colors.greenSoft})` : "transparent"};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--radio-color, ${({ theme }) => theme.colors.border});
    background: ${({ theme }) => theme.colors.bgHover};
  }

  .radio-icon {
    color: var(--radio-color);
    font-size: 20px;
    flex-shrink: 0;
  }

  .radio-text {
    font-size: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
  }
`;

export const RadioInput = styled.input.attrs({ type: "radio" })`
  display: none;
`;

export const SplitMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const SplitMethodRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SplitMethodLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.textSoft};
`;

export const SplitRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
`;

export const DropdownWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

export const DropdownTrigger = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  cursor: pointer;
  text-align: left;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.greenBorder};
  }

  .dropdown-icon {
    color: var(--trigger-color, ${({ theme }) => theme.text});
    font-size: 18px;
    flex-shrink: 0;
  }

  .dropdown-text {
    flex: 1;
    min-width: 0;
  }
`;

export const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  max-height: 220px;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.background};
  box-shadow: ${({ theme }) => theme.shadow.md};
  z-index: 10;
`;

export const DropdownOption = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }

  .option-icon {
    color: var(--option-color);
    font-size: 18px;
    flex-shrink: 0;
  }

  .option-text {
    flex: 1;
    min-width: 0;
  }
`;

export const AmountInput = styled(Input)`
  width: 120px;
  flex-shrink: 0;
`;

export const TotalEntered = styled.div<{ $valid?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $valid, theme }) =>
    $valid ? theme.colors.success : theme.colors.danger};
`;

export const OptionsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  justify-content: flex-end;
`;

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    font-size: 16px;
  }
`;

export const ConfirmIcon = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.colors.greenBorder};
`;

export const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.bgSoft};
  border: 2px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.text};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;

export const ConfirmButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.bgSoft};
  border: 2px solid ${({ theme }) => theme.colors.greenBorder};
  color: ${({ theme }) => theme.text};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.greenSoft};
  }
`;

export const PrecuentaButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.bgSoft};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.text};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;
