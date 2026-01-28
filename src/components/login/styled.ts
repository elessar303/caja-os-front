import styled from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.background} 0%,
    ${({ theme }) => theme.backgroundSoft} 100%
  );
  position: relative;
`;

export const ThemeToggle = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.text} !important;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  svg {
    font-size: 18px;
    color: ${({ theme }) => theme.text} !important;
    flex-shrink: 0;
  }
`;

export const LoginLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-width: 0;
`;

interface LoginRightProps {
  isDarkMode: boolean;
}

export const LoginRight = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDarkMode",
})<LoginRightProps>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: ${({ theme }) => theme.backgroundSoft};
  min-width: 0;
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("/login_bg.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: ${({ isDarkMode }) => (isDarkMode ? 1 : 0)};
    transition: opacity 0.8s ease-in-out;
    z-index: 0;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("/login_bg2.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: ${({ isDarkMode }) => (isDarkMode ? 0 : 1)};
    transition: opacity 0.8s ease-in-out;
    z-index: 1;
  }

  & > * {
    position: relative;
    z-index: 2;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

export const LogoIcon = styled.img`
  height: 150px;
  object-fit: contain;
  margin-bottom: 12px;
`;

export const LogoBg = styled.img``;

export const LogoText = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.text};
  margin-bottom: 4px;
`;

export const VersionText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 0;
`;

export const WelcomeText = styled.h2`
  font-size: 28px;
  font-weight: 500;
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

export const InstructionText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
  margin: 0 0 32px 0;
  text-align: center;
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin-bottom: 24px;
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.backgroundSoft};
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentAlpha};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSoft};
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 8px;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.accent};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const CheckboxLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

export const ContinueButton = styled.button`
  width: 100%;
  height: 48px;
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ContactButton = styled.button`
  width: auto;
  height: 48px;
  background: transparent;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  svg {
    font-size: 18px;
  }
`;

export const NewBusinessLink = styled.a`
  display: block;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
    text-decoration: underline;
  }
`;

export const ErrorMessage = styled.div`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.danger}20;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
`;
