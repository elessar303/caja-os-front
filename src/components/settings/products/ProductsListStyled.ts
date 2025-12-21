import styled from "styled-components";

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
`;

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Description = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  font-weight: 400;
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const HeaderActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSoft};
  color: ${({ theme }) => theme.text} !important;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.greenBorder};
    color: ${({ theme }) => theme.colors.greenBorder} !important;
  }

  svg {
    font-size: 14px;
    width: 14px;
    height: 14px;
    display: block;
    color: inherit !important;
    flex-shrink: 0;
  }
`;

export const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
  width: 100%;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSoft};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  min-width: 0;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.greenBorder};
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSoft};
  }
`;

export const SortSelect = styled.select`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSoft};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  cursor: pointer;
  min-width: 140px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.greenBorder};
  }
`;

export const CategorySelect = styled.select`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSoft};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  cursor: pointer;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.greenBorder};
  }
`;

export const ClearFilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSoft};
  color: ${({ theme }) => theme.text} !important;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.greenBorder};
    color: ${({ theme }) => theme.colors.greenBorder} !important;
  }

  svg {
    font-size: 14px;
    width: 14px;
    height: 14px;
    display: block;
    color: inherit !important;
    flex-shrink: 0;
  }
`;

export const ProductsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

export const TableRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bgSoft};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.greenBorder};
  }
`;

interface TableCellProps {
  flex?: string;
}

export const TableCell = styled.div<TableCellProps>`
  display: flex;
  align-items: center;
  min-width: 0;
  flex: ${({ flex }) => flex || "0 0 auto"};
`;

export const ImageCell = styled(TableCell)`
  width: 80px;
  min-width: 80px;
  max-width: 80px;
  flex: 0 0 80px;
`;

export const TableCellFlex = styled(TableCell)`
  flex: 1;
  min-width: 0;
`;

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const ProductName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const ProductBarcode = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

export const ProductStock = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

export const StockLowPill = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  font-size: 10px;
  font-weight: 600;
`;

export const ProductPrice = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const ProductProfit = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSoft};
  color: ${({ theme }) => theme.text} !important;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.greenBorder};
    color: ${({ theme }) => theme.colors.greenBorder} !important;
  }

  svg {
    font-size: 14px;
    width: 14px;
    height: 14px;
    display: block;
    color: inherit !important;
    flex-shrink: 0;
  }
`;

export const DeleteButton = styled(ActionButton)`
  color: ${({ theme }) => theme.colors.danger} !important;

  &:hover {
    background: ${({ theme }) => theme.colors.danger};
    border-color: ${({ theme }) => theme.colors.danger};
    color: white !important;
  }

  svg {
    color: inherit !important;
  }
`;

export const ProductImage = styled.div`
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  background: ${({ theme }) => theme.colors.bgHover};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  min-height: 80px;
`;
