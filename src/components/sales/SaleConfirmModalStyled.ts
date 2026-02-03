import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

interface ModalContainerProps {
  $darkMode?: boolean;
}

export const ModalContainer = styled.div<ModalContainerProps>`
  background: ${({ theme }) => theme.background};
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSoft};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.colors.bgHover};
  }

  svg {
    font-size: 18px;
  }
`;

export const ModalBody = styled.div`
  padding: 24px 20px;
  text-align: center;
`;

export const ConfirmMessage = styled.p`
  margin: 0 0 12px 0;
  font-size: 16px;
  color: ${({ theme }) => theme.text};

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    font-weight: 600;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  justify-content: center;
`;

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    font-size: 16px;
  }
`;

export const ConfirmButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.bgSoft};
  border: 2px solid #22c55e;
  color: ${({ theme }) => theme.text};

  &:hover {
    background: rgba(34, 197, 94, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.bgSoft};
  border: 2px solid #ef4444;
  color: ${({ theme }) => theme.text};

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
