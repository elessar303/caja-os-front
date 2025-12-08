import styled from "styled-components";

export const SellProductItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 12px;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
  position: relative;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSoft};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ProductRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
`;

export const ProductImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

export const ProductImage = styled.div`
  width: 60px;
  height: 60px;
  min-width: 60px;
  min-height: 60px;
  background: ${({ theme }) => theme.colors.bgSoft};
  border-radius: 10px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  /* Mismo estilo que la imagen de la grilla de productos */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.bgSoft};
    border-radius: 10px;
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.bgHover};
    opacity: 0.4;
  }
`;

export const ProductInfo = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  padding-right: 4px;
  overflow: visible;
  max-width: 100%;
  width: 100%;
`;

export const ProductNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  width: 100%;
  overflow: visible;
`;

export const ProductName = styled.div`
  font-size: 11px;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow: visible;
  flex: 1;
  min-width: 0;
  max-width: 100%;
`;

export const ProductDetails = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.text};
  font-weight: 400;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow: visible;
`;

export const ProductPrice = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.textSoft};
  font-weight: 400;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const NewTag = styled.span`
  display: inline-block;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.greenBorder};
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  text-align: center;
  width: 100%;
`;

export const NoteFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  min-width: 0;
  box-sizing: border-box;
`;

export const AddNoteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
  flex-shrink: 0;

  svg {
    font-size: 13px;
    width: 13px;
    height: 13px;
  }

  span {
    font-size: 12px;
  }

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

export const NoteInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
`;

export const NoteDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
  justify-content: flex-end;

  span {
    font-weight: 600;
    color: ${({ theme }) => theme.text};
  }

  em {
    font-style: italic;
    color: ${({ theme }) => theme.text};
  }
`;

export const NoteInput = styled.input`
  flex: 1;
  padding: 6px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text} !important;
  font-size: 12px;
  outline: none;
  transition: border-color 0.2s ease;
  min-width: 0;
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => theme.textSoft};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.greenBorder};
  }
`;

interface NoteActionButtonProps {
  color: "green" | "red";
}

export const NoteActionButton = styled.button<NoteActionButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  border-radius: 4px;
  border: none;
  background: ${({ theme, color }) =>
    color === "green" ? theme.colors.greenSoft : theme.colors.danger};
  color: ${({ theme, color }) =>
    color === "green" ? theme.colors.greenBorder : "white"} !important;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;
  margin: 0;

  > svg {
    font-size: 12px;
    width: 12px;
    height: 12px;
    display: block;
    color: inherit !important;
  }

  &:hover {
    background: ${({ theme, color }) =>
      color === "green" ? theme.colors.greenFocus : theme.colors.dangerHover};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const QuantityControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-right: 2px;
  flex-shrink: 0;
`;

export const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgSoft};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.shadowSoft};
  flex-shrink: 0;
  padding: 0;
  margin: 0;
  color: ${({ theme }) => theme.text};

  > svg {
    font-size: 14px;
    width: 14px;
    height: 14px;
    display: block;
    color: currentColor;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.greenBorder};
    color: ${({ theme }) => theme.colors.greenBorder};
    box-shadow: 0 2px 6px ${({ theme }) => theme.colors.shadowSoft};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const QuantityValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  min-width: 24px;
  text-align: center;
  line-height: 1;
`;

export const TotalPrice = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  min-width: 60px;
  text-align: right;
  align-self: flex-start;
  padding-top: 2px;
  flex-shrink: 0;
`;

