import {
  FaHome,
  FaAngleDoubleLeft,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import {
  FooterWrapper,
  FooterContent,
  PageInfo,
  NavButtons,
  NavButton,
} from "./styled";

interface FooterProps {
  currentPage: number;
  totalPages: number;
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
}

export default function Footer({
  currentPage,
  totalPages,
  onFirst,
  onPrevious,
  onNext,
  onLast,
}: FooterProps) {
  return (
    <FooterWrapper>
      <FooterContent>
        <PageInfo>
          Página {currentPage} / {totalPages}
        </PageInfo>
        <NavButtons>
          <NavButton
            onClick={onFirst}
            disabled={currentPage === 1}
            aria-label="Primera página"
          >
            <FaHome />
          </NavButton>
          <NavButton
            onClick={onFirst}
            disabled={currentPage === 1}
            aria-label="Primera página"
          >
            <FaAngleDoubleLeft />
          </NavButton>
          <NavButton
            onClick={onPrevious}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            <FaChevronLeft />
          </NavButton>
          <NavButton
            onClick={onNext}
            disabled={currentPage === totalPages}
            aria-label="Página siguiente"
          >
            <FaChevronRight />
          </NavButton>
          <NavButton
            onClick={onLast}
            disabled={currentPage === totalPages}
            aria-label="Última página"
          >
            <FaAngleDoubleRight />
          </NavButton>
        </NavButtons>
      </FooterContent>
    </FooterWrapper>
  );
}
