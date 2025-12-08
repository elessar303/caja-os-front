import type { ReactNode } from "react";
import { MainWrapper } from "./styled";

interface Props {
  children: ReactNode;
}

export default function MainContent({ children }: Props) {
  return <MainWrapper>{children}</MainWrapper>;
}
