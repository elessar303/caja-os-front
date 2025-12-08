import styled from "styled-components";

export const Wrapper = styled.div`
  width: calc(100% - 32px);
  max-width: calc(100% - 32px);
  height: 48px;
  background: ${({ theme }) => theme.colors.bgSoft};
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }

  &:focus-within {
    background: ${({ theme }) => theme.backgroundSoft};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.greenBorder},
      0 0 0 3px ${({ theme }) => theme.colors.greenFocus};
  }
`;

export const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 15px;
  color: ${({ theme }) => theme.text};

  /* Eliminar todos los estilos por defecto del input */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSoft};
  }
`;

export const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 16px;
  transition: color 0.2s ease;

  ${Wrapper}:focus-within & {
    color: ${({ theme }) => theme.colors.greenBorder};
  }
`;
