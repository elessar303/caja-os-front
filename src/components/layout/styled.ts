import styled from "styled-components";

export const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-x: hidden;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  background: ${({ theme }) => theme.header};
  color: ${({ theme }) => theme.text};
  height: 68px;
  padding: 0 10px;
  user-select: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  gap: 10px;
`;

export const HeaderGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

interface BreadcrumbItemProps {
  isActive?: boolean;
}

export const BreadcrumbItem = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "isActive",
})<BreadcrumbItemProps>`
  font-weight: ${({ isActive }) => (isActive ? 700 : 400)};
  color: ${({ theme, isActive }) =>
    isActive ? theme.text : theme.textSoft};
`;

export const BreadcrumbSeparator = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

export const MiddleHeaderGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`;

interface HeaderItemProps {
  isActive?: boolean;
}

export const HeaderItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isActive",
})<HeaderItemProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.greenBorder : theme.textSoft};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    font-size: 18px;
    margin-bottom: 2px;
  }

  &:hover {
    color: ${({ theme, isActive }) =>
      isActive ? theme.colors.greenBorder : theme.text};
  }

  ${({ isActive, theme }) =>
    isActive &&
    `
    color: ${theme.colors.greenBorder};
  `}

  .auto-btn {
    background: ${({ theme }) => theme.colors.success};
    color: white;
    border-radius: 25px;
    padding: 6px 14px;
    font-size: 12px;
    border: none;
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.colors.successHover};
    }
  }
`;

export const Icon = styled.img`
  width: 22px;
  height: 22px;
  margin-bottom: 2px;
`;

export const ChargeButton = styled.button`
  height: 100%;
  background: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.text};
  font-weight: bold;
  font-size: 20px;
  border: none;
  padding: 0 25px;
  cursor: pointer;
  flex-shrink: 0;
  min-height: 44px;

  &:hover {
    background: ${({ theme }) => theme.colors.successHover};
  }
`;

interface MiddleHeaderButtonProps {
  isActive?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  disabled?: boolean;
  $paymentColor?: string;
}

export const MiddleHeaderButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !["isActive", "isFirst", "isLast", "$paymentColor"].includes(prop),
})<MiddleHeaderButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 28px;
  min-width: 130px;
  height: 100%;
  border-radius: 0;
  border-top: none;
  border-bottom: none;
  border-left: 2px solid
    ${({ theme, isActive }) =>
      isActive ? theme.colors.greenBorder : theme.colors.border};
  border-right: 2px solid
    ${({ theme, isActive }) =>
      isActive ? theme.colors.greenBorder : theme.colors.border};
  ${({ isFirst }) => isFirst && "border-top-left-radius: 8px; border-bottom-left-radius: 8px;"}
  ${({ isLast }) => isLast && "border-top-right-radius: 8px; border-bottom-right-radius: 8px;"}
  margin-left: ${({ isFirst }) => (isFirst ? "0" : "-2px")};
  background: ${({ theme, isActive, disabled }) =>
    disabled
      ? theme.colors.bgSoft
      : isActive
      ? theme.colors.greenSoft
      : theme.colors.bgSoft};
  color: ${({ theme, isActive, disabled, $paymentColor }) =>
    disabled
      ? theme.textSoft
      : isActive
      ? theme.colors.greenBorder
      : $paymentColor || theme.textSoft};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: all 0.2s ease;
  font-size: 12px;
  gap: 4px;
  position: relative;
  z-index: ${({ isActive }) => (isActive ? 1 : 0)};

  svg {
    font-size: 20px;
    color: ${({ theme, isActive, $paymentColor }) =>
      isActive ? theme.colors.greenBorder : $paymentColor || theme.textSoft};
  }

  span {
    font-weight: ${({ isActive }) => (isActive ? 600 : 500)};
    font-size: ${({ isActive }) => (isActive ? "14px" : "12px")};
  }

  &:hover:not(:disabled) {
    border-left-color: ${({ theme, isActive }) =>
      isActive ? theme.colors.greenBorder : theme.colors.borderHover};
    border-right-color: ${({ theme, isActive }) =>
      isActive ? theme.colors.greenBorder : theme.colors.borderHover};
    background: ${({ theme, isActive }) =>
      isActive ? theme.colors.greenFocus : theme.colors.bgHover};
    color: ${({ theme, isActive }) =>
      isActive ? theme.colors.greenBorder : theme.text};
    z-index: 2;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const SidebarWrapper = styled.aside`
  width: 420px;
  min-width: 420px;
  max-width: 420px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.backgroundSoft};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
`;

export const SellProductsList = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 16px;
  padding-right: 4px;

  /* Estilos para el scrollbar */
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

export const Empty = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.textSoft};
`;

export const Bottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 20px;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
`;

export const Cancel = styled.button<{ disabled?: boolean }>`
  width: 100%;
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.bgSoft : theme.colors.danger};
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
  color: ${({ disabled }) => (disabled ? "#999" : "white")};
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.dangerHover};
  }
`;

export const FooterWrapper = styled.footer`
  height: 80px;
  min-height: 80px;
  max-height: 80px;
  background: ${({ theme }) => theme.colors.bgSoft};
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  margin-top: auto;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
  flex-shrink: 0;
`;

export const FooterContent = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
  overflow: hidden;
`;

export const PageInfo = styled.span`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 14px;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const NavButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
  min-width: 0;
`;

export const NavButton = styled.button<{ disabled?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.textSoft : theme.text} !important;
  transition: all 0.2s ease;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.greenBorder};
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  svg {
    font-size: 16px;
    width: 16px;
    height: 16px;
    display: block;
    flex-shrink: 0;
  }
`;
