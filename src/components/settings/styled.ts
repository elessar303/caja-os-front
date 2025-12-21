import styled from "styled-components";

export const SettingsGrid = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "cardSize",
})<{ cardSize?: number }>`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: ${({ cardSize }) => (cardSize ? `${cardSize}px` : "auto")};
  padding: 20px 16px;
  flex: 1;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: 100%;
  align-content: start;
`;

export const SettingsCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "cardSize",
})<{ cardSize?: number }>`
  width: 100%;
  height: ${({ cardSize }) => (cardSize ? `${cardSize}px` : "100%")};
  background: ${({ theme }) => theme.colors.bgSoft};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  cursor: pointer;
  transition: 0.25s ease;
  box-sizing: border-box;
  gap: 12px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.greenBorder};
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;

export const SettingsIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgHover};
  color: ${({ theme }) => theme.textSoft};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  transition: 0.25s ease;
  flex-shrink: 0;

  svg {
    width: 36px;
    height: 36px;
    display: block;
  }

  ${SettingsCard}:hover & {
    background: ${({ theme }) => theme.colors.greenSoft};
    color: ${({ theme }) => theme.colors.greenBorder};
  }
`;

export const SettingsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.text};
  margin: 0;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const SettingsSubtitle = styled.p`
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.textSoft};
  margin: 0;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

