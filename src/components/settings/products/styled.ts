import styled from "styled-components";

export const ManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 16px;
  box-sizing: border-box;
`;

export const ToggleButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  width: 100%;
`;

interface ToggleButtonProps {
  isActive?: boolean;
}

export const ToggleButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "isActive",
})<ToggleButtonProps>`
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid
    ${({ theme, isActive }) =>
      isActive ? theme.colors.greenBorder : theme.colors.border};
  background: ${({ theme, isActive }) =>
    isActive ? theme.colors.greenSoft : theme.colors.bgSoft};
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.greenBorder : theme.text};
  font-size: 14px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 500)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.greenBorder};
    background: ${({ theme, isActive }) =>
      isActive ? theme.colors.greenSoft : theme.colors.bgHover};
  }
`;

