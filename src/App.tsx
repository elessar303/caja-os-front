import { useState } from "react";
import { GlobalStyles } from "./styles/globalStyles";

import Header from "./components/layout/header";
import Sidebar from "./components/layout/sidebar";
import MainContent from "./components/layout/main";
import Settings from "./components/settings";

import SearchBar from "./components/search/";
import CategoryTabs from "./components/categories";
import ProductGrid from "./components/products";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<"main" | "products" | "stock" | "users">("main");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleSettingsToggle = () => {
    setIsSettingsOpen(true);
    setSettingsView("main");
  };

  const handleBackToMain = () => {
    if (settingsView === "products" || settingsView === "stock" || settingsView === "users") {
      setSettingsView("main");
      setIsSettingsOpen(true); // Mantener settings abierto pero volver a la vista principal
    } else {
      setIsSettingsOpen(false);
      setSettingsView("main");
    }
  };

  const handleSettingsNavigation = (view: "main" | "products" | "stock" | "users") => {
    setSettingsView(view);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <>
      <GlobalStyles />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100vw",
          maxWidth: "100vw",
          overflow: "hidden",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <Header
          isSettingsOpen={isSettingsOpen || settingsView !== "main"}
          onSettingsToggle={handleSettingsToggle}
          onBackToMain={handleBackToMain}
          settingsView={settingsView}
        />

        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            minWidth: 0,
            maxWidth: "100%",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {!isSettingsOpen && <Sidebar />}

          <MainContent>
            {isSettingsOpen || settingsView !== "main" ? (
              <Settings 
                onNavigate={handleSettingsNavigation} 
                currentView={settingsView}
              />
            ) : (
              <>
                <SearchBar onSearchChange={setSearchTerm} />
                <CategoryTabs onCategoryChange={handleCategoryChange} />
                <ProductGrid searchTerm={searchTerm} selectedCategoryId={selectedCategoryId} />
              </>
            )}
          </MainContent>
        </div>
      </div>
    </>
  );
}
