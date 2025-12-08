import { useState, useRef, useContext } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { TabsContainer, Tabs, Tab, NavButton, LoadingMessage } from "./styled";
import { AppContext } from "../../context/app";

export default function CategoryTabs() {
  const { categories, categoriesLoading } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<string>("todos");
  const tabsRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        tabsRef.current.scrollLeft +
        (direction === "right" ? scrollAmount : -scrollAmount);
      tabsRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (categoriesLoading) {
    return (
      <TabsContainer>
        <Tabs ref={tabsRef}>
          <LoadingMessage>Cargando categorías...</LoadingMessage>
        </Tabs>
      </TabsContainer>
    );
  }

  return (
    <TabsContainer>
      <NavButton position="left" onClick={() => scroll("left")}>
        <FaChevronLeft />
      </NavButton>
      <Tabs ref={tabsRef}>
        {categories.length > 0 ? (
          categories.map((category) => {
            const initial = category.description.charAt(0).toUpperCase();

            return (
              <Tab
                key={category.id}
                active={activeTab === category.id}
                onClick={() => setActiveTab(category.id)}
              >
                <div className="circle">{initial}</div>
                <span className="label">{category.description}</span>
              </Tab>
            );
          })
        ) : (
          <LoadingMessage>No hay categorías disponibles</LoadingMessage>
        )}
      </Tabs>
      <NavButton position="right" onClick={() => scroll("right")}>
        <FaChevronRight />
      </NavButton>
    </TabsContainer>
  );
}
