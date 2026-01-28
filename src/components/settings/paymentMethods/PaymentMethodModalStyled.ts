import styled from "styled-components";
import {
  ModalOverlay as BaseModalOverlay,
  ModalContainer as BaseModalContainer,
  ModalHeader as BaseModalHeader,
  ModalTitle as BaseModalTitle,
  ModalSubtitle as BaseModalSubtitle,
  CloseButton as BaseCloseButton,
  ModalBody as BaseModalBody,
  FormRow as BaseFormRow,
  FormGroup as BaseFormGroup,
  Label as BaseLabel,
  Input as BaseInput,
  ButtonGroup as BaseButtonGroup,
  CancelButton as BaseCancelButton,
  SaveButton as BaseSaveButton,
} from "../categories/CategoryModalStyled";

export const ModalOverlay = styled(BaseModalOverlay)``;
export const ModalContainer = styled(BaseModalContainer)``;
export const ModalHeader = styled(BaseModalHeader)``;
export const ModalTitle = styled(BaseModalTitle)``;
export const ModalSubtitle = styled(BaseModalSubtitle)``;
export const CloseButton = styled(BaseCloseButton)``;
export const ModalBody = styled(BaseModalBody)``;
export const FormRow = styled(BaseFormRow)``;
export const FormGroup = styled(BaseFormGroup)``;
export const Label = styled(BaseLabel)``;
export const Input = styled(BaseInput)``;
export const ButtonGroup = styled(BaseButtonGroup)``;
export const CancelButton = styled(BaseCancelButton)``;
export const SaveButton = styled(BaseSaveButton)``;

export const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSoft};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
  height: 40px;
  box-sizing: border-box;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.greenBorder};
  }
`;

export const IconSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 8px;
`;

interface IconOptionProps {
  $isSelected: boolean;
}

export const IconOption = styled.button<IconOptionProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid
    ${({ $isSelected, theme }) =>
      $isSelected ? theme.colors.greenBorder : theme.colors.border};
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.greenSoft : theme.colors.bgSoft};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 500;

  &:hover {
    border-color: ${({ theme }) => theme.colors.greenBorder};
    background: ${({ theme }) => theme.colors.greenSoft};
  }

  span {
    text-align: center;
  }
`;

interface IconPreviewProps {
  $color: string;
}

export const IconPreview = styled.div<IconPreviewProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  color: white;

  svg {
    width: 20px;
    height: 20px;
    display: block;
  }
`;

export const ColorSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`;

interface ColorOptionProps {
  $isSelected: boolean;
}

export const ColorOption = styled.button<ColorOptionProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  border: 3px solid
    ${({ $isSelected, theme }) =>
      $isSelected ? theme.colors.greenBorder : "transparent"};
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.greenBorder};
    transform: scale(1.1);
  }
`;

interface ColorCircleProps {
  $color: string;
}

export const ColorCircle = styled.div<ColorCircleProps>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.colors.border};
`;
