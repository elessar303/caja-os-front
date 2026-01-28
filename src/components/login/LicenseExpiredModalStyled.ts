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
  z-index: 2000;
  padding: 20px;
`;

export const ModalContainer = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 2px solid #ff8904;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

export const ModalTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const AlertIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff8904;
  flex-shrink: 0;
  margin-top: 2px;

  svg {
    font-size: 28px;
    width: 28px;
    height: 28px;
    display: block;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 8px 0;
`;

export const ModalSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
  margin: 0;
`;

export const CloseButton = styled.button`
  background: ${({ theme }) => theme.colors.bgSoft};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.text} !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.greenBorder};
    color: ${({ theme }) => theme.colors.greenBorder} !important;
  }

  svg {
    font-size: 18px;
    width: 18px;
    height: 18px;
    display: block;
    color: inherit !important;
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ModalMessage = styled.p`
  font-size: 16px;
  color: #ff8904;
  font-weight: 700;
  margin: 0;
  line-height: 1.5;
  text-align: center;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

export const RenewButton = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: #25d366;
  color: white !important;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);

  &:hover {
    background: #1fa855; // Verde más oscuro sutilmente
    color: white !important;
    box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    background: #1a8f4a; // Aún más oscuro al hacer click
    color: white !important;
  }

  &:visited {
    color: white !important;
  }

  svg {
    font-size: 20px;
    width: 20px;
    height: 20px;
    display: block;
    flex-shrink: 0;
    color: white !important;
  }
`;
