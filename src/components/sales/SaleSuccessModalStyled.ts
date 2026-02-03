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
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 2px solid #22c55e;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px 20px;
  text-align: center;
`;

export const SuccessIcon = styled.div`
  color: #22c55e;
  margin-bottom: 16px;

  svg {
    font-size: 56px;
  }
`;

export const ModalTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const ModalSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

export const ModalBody = styled.div`
  padding: 0 24px 24px;
`;

export const DataBox = styled.div`
  background: ${({ theme }) => theme.colors.bgSoft};
  border-radius: 12px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

export const DataLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  font-weight: 500;
`;

interface DataValueProps {
  $highlight?: boolean;
}

export const DataValue = styled.span<DataValueProps>`
  font-size: ${({ $highlight }) => ($highlight ? "18px" : "14px")};
  font-weight: ${({ $highlight }) => ($highlight ? "700" : "500")};
  color: ${({ theme, $highlight }) =>
    $highlight ? "#22c55e" : theme.text};
`;

export const ModalFooter = styled.div`
  padding: 0 24px 24px;
`;

export const CloseButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #22c55e;
  border: none;
  color: white;

  &:hover {
    background: #16a34a;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
