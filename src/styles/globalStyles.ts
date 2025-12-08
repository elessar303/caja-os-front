import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: "Inter", sans-serif;
    height: 100vh;
    width: 100vw;
    max-width: 100vw;
    overflow: hidden;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  #root {
    width: 100vw;
    max-width: 100vw;
    overflow: hidden;
    box-sizing: border-box;
  }

  button {
    cursor: pointer;
    border: none;
  }
`;
