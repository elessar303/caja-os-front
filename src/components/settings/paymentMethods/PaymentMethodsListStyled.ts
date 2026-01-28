import styled from "styled-components";
import {
  HeaderSection as BaseHeaderSection,
  TitleSection as BaseTitleSection,
  Title as BaseTitle,
  Description as BaseDescription,
  ActionsContainer as BaseActionsContainer,
  HeaderActionButton as BaseHeaderActionButton,
  DeleteButton as BaseDeleteButton,
} from "../products/ProductsListStyled";

export const PaymentMethodsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 16px;
  box-sizing: border-box;
`;

export const HeaderSection = styled(BaseHeaderSection)``;
export const TitleSection = styled(BaseTitleSection)``;
export const Title = styled(BaseTitle)``;
export const Description = styled(BaseDescription)``;
export const ActionsContainer = styled(BaseActionsContainer)``;
export const HeaderActionButton = styled(BaseHeaderActionButton)``;

export const PaymentMethodsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  overflow-y: auto;
  flex: 1;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bgSoft};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => theme.colors.borderHover};
    }
  }
`;

interface PaymentMethodItemProps {
  $isDragging?: boolean;
  $isDragOver?: boolean;
}

export const PaymentMethodItem = styled.div<PaymentMethodItemProps>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.card};
  border: 2px solid
    ${({ $isDragOver, $isDragging, theme }) =>
      $isDragOver
        ? theme.colors.greenBorder
        : $isDragging
        ? theme.colors.border
        : theme.colors.cardBorder};
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: move;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};

  &:hover {
    border-color: ${({ $isDragOver, theme }) =>
      $isDragOver ? theme.colors.greenBorder : theme.colors.cardBorderHover};
    background: ${({ theme }) => theme.colors.cardHover};
  }
`;

export const DragHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textSoft};
  cursor: grab;
  flex-shrink: 0;
  pointer-events: none;

  &:active {
    cursor: grabbing;
  }

  svg {
    width: 16px;
    height: 16px;
    display: block;
  }
`;

interface IconContainerProps {
  $color: string;
}

export const IconContainer = styled.div<IconContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  color: white;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
    display: block;
  }
`;

export const PaymentMethodInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const PaymentMethodName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const PaymentMethodCode = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textSoft};
`;

export const StatusPill = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;

  &.active {
    background: rgba(34, 197, 94, 0.15);
    color: #10b981;
  }

  &.inactive {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }
`;

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ToggleSwitch = styled.input`
  width: 44px;
  height: 24px;
  appearance: none;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;

  &:checked {
    background: ${({ theme }) => theme.colors.greenBorder || "#16a34a"};
  }

  &:before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: 3px;
    transition: transform 0.2s ease;
  }

  &:checked:before {
    transform: translateX(20px);
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const DeleteButton = styled(BaseDeleteButton)``;
