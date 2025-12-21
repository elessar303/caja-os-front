import styled from "styled-components";

export const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  margin-top: 16px;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSoft};
  color: ${({ theme }) => theme.text};
  font-size: 14px;

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

export const StockTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.bgHover};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

interface HeaderCellProps {
  flex?: number;
  alignLeft?: boolean;
}

export const HeaderCell = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "flex" && prop !== "alignLeft",
})<HeaderCellProps>`
  flex: ${({ flex }) => flex || 1};
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: ${({ alignLeft }) => (alignLeft ? "flex-start" : "center")};
`;

export const TableRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 16px;
  padding: 8px 16px;
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
  justify-content: center;
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

export const StockValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

export const StockPill = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

export const StockPillNormal = styled(StockPill)`
  background: ${({ theme }) => theme.colors.success || "#10b981"};
  color: white;
`;

export const StockPillLow = styled(StockPill)`
  background: ${({ theme }) => theme.colors.danger};
  color: white;
`;

