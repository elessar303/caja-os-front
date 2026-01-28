import styled from "styled-components";

export const GridContainer = styled.div`
  margin-top: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 0;
  max-width: 100%;
  height: 100%;
`;

export const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  padding-bottom: 20px;
  padding-left: 16px;
  padding-right: 16px;
  flex: 1;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
`;

export const Card = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  cursor: pointer;
  transition: 0.25s ease;
  box-sizing: border-box;

  &:hover {
    background: ${({ theme }) => theme.colors.cardHover};
    border-color: ${({ theme }) => theme.colors.cardBorderHover};
    box-shadow: 0px 4px 10px ${({ theme }) => theme.colors.shadowSoft};
  }
`;

export const Img = styled.img`
  width: auto;
  height: 70px;
  min-height: 70px;
  background: ${({ theme }) => theme.colors.bgSoft};
  border-radius: 10px;
  flex-shrink: 0;
  object-fit: cover;
`;

export const ImagePlaceholder = styled.div`
  width: auto;
  height: 70px;
  min-height: 70px;
  background: ${({ theme }) => theme.colors.bgSoft};
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Barcode = styled.p`
  margin-top: 6px;
  font-size: 10px;
  text-align: center;
  color: ${({ theme }) => theme.textSoft};
  font-family: monospace;
  letter-spacing: 0.5px;
  line-height: 1.2;
  word-break: break-all;
`;

export const Name = styled.p`
  margin-top: 4px;
  font-size: 12px;
  text-align: center;
  color: ${({ theme }) => theme.text};
  line-height: 1.3;
  flex: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Price = styled.p`
  margin-top: 4px;
  font-size: 13px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
`;

export const LoadingMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 16px;
`;
