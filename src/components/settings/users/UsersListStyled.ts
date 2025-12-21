import styled from "styled-components";
import {
  HeaderSection as BaseHeaderSection,
  TitleSection as BaseTitleSection,
  Title as BaseTitle,
  Description as BaseDescription,
  ActionsContainer as BaseActionsContainer,
  HeaderActionButton as BaseHeaderActionButton,
  FiltersContainer as BaseFiltersContainer,
  SearchInput as BaseSearchInput,
  ProductsTable as BaseProductsTable,
  TableRow as BaseTableRow,
  TableCell as BaseTableCell,
  TableCellFlex as BaseTableCellFlex,
  ActionButtons as BaseActionButtons,
  ActionButton as BaseActionButton,
  DeleteButton as BaseDeleteButton,
} from "../products/ProductsListStyled";

export const UsersContainer = styled.div`
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
export const FiltersContainer = styled(BaseFiltersContainer)``;
export const SearchInput = styled(BaseSearchInput)``;
export const UsersTable = styled(BaseProductsTable)``;
export const TableRow = styled(BaseTableRow)``;
export const TableCell = styled(BaseTableCell)``;
export const TableCellFlex = styled(BaseTableCellFlex)``;
export const ActionButtons = styled(BaseActionButtons)``;
export const ActionButton = styled(BaseActionButton)``;
export const DeleteButton = styled(BaseDeleteButton)``;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

export const RoleIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.text};

  svg {
    width: 20px;
    height: 20px;
    display: block;
  }
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const UsernameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Username = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const RolePill = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;

  &.admin {
    background: ${({ theme }) => theme.colors.danger || "#ef4444"};
    color: white;
  }

  &.cashier {
    background: ${({ theme }) => theme.colors.success || "#10b981"};
    color: white;
  }

  &.mozo {
    background: ${({ theme }) => theme.colors.greenSoft || "#86efac"};
    color: ${({ theme }) => theme.colors.greenBorder || "#16a34a"};
  }
`;

export const CreatedDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

export const FullName = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

export const Email = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

export const StatusPill = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;

  &.active {
    background: ${({ theme }) => theme.colors.success || "#10b981"};
    color: white;
  }

  &.inactive {
    background: ${({ theme }) => theme.colors.danger || "#ef4444"};
    color: white;
  }
`;

