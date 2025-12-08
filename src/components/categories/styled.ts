import styled from "styled-components";

export const TabsContainer = styled.div`
  position: relative;
  margin-top: 12px;
  margin-left: 16px;
  margin-right: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  max-width: calc(100% - 32px);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-behavior: smooth;
  flex: 1;
  min-width: 0;

  /* Ocultar scrollbar pero mantener funcionalidad */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

interface NavButtonProps {
  position: "left" | "right";
}

export const NavButton = styled.button<NavButtonProps>`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 4px;

  &:hover {
    color: ${({ theme }) => theme.colors.greenBorder};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    font-size: 20px;
    width: 20px;
    height: 20px;
    display: block;
    flex-shrink: 0;
  }
`;

interface TabProps {
  active?: boolean;
}

export const Tab = styled.button<TabProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 120px;
  height: 120px;
  aspect-ratio: 1;
  padding: 12px;
  border-radius: 12px;
  box-sizing: border-box;
  flex-shrink: 0;

  .circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.textSoft};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 18px;
    transition: 0.25s ease;
  }

  .label {
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    max-width: 100%;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  background: ${({ active, theme }) =>
    active
      ? `
        linear-gradient(
          0deg,
          ${theme.colors.greenSoft},
          ${theme.colors.greenSoft}
        ),
        ${theme.backgroundSoft}
      `
      : theme.colors.bgSoft};

  border: 2px solid
    ${({ active, theme }) =>
      active ? theme.colors.greenBorder : "transparent"};

  color: ${({ theme }) => theme.text};
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: 0.25s ease;

  outline: none;

  &:hover {
    border-color: ${({ theme }) => theme.colors.greenBorder};

    background: ${({ active, theme }) =>
      active
        ? `
          linear-gradient(
            0deg,
            ${theme.colors.greenFocus},
            ${theme.colors.greenFocus}
          ),
          ${theme.backgroundSoft}
        `
        : theme.colors.bgHover};
  }
  &:focus,
  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.greenBorder};
  }

  ${({ active, theme }) =>
    active &&
    `border-color: ${theme.colors.greenBorder};
    .circle {
      background: ${theme.colors.greenSoft};
      color: ${theme.colors.greenBorder};
    }
    .label {
      color: ${theme.colors.greenBorder};
    }
`}
`;

export const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 14px;
`;
