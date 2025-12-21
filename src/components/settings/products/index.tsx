import { useState } from "react";
import ProductsList from "./ProductsList";
import CategoriesList from "../categories/CategoriesList";
import { ManagementContainer, ToggleButtons, ToggleButton } from "./styled";

export default function ProductsManagement() {
  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products"
  );

  return (
    <ManagementContainer>
      <ToggleButtons>
        <ToggleButton
          isActive={activeTab === "products"}
          onClick={() => setActiveTab("products")}
        >
          Productos
        </ToggleButton>
        <ToggleButton
          isActive={activeTab === "categories"}
          onClick={() => setActiveTab("categories")}
        >
          Categorías
        </ToggleButton>
      </ToggleButtons>

      {activeTab === "products" ? <ProductsList /> : <CategoriesList />}
    </ManagementContainer>
  );
}
