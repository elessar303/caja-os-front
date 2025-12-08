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

  const handleSettingsToggle = () => {
    setIsSettingsOpen(true);
  };

  const handleBackToMain = () => {
    setIsSettingsOpen(false);
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
          isSettingsOpen={isSettingsOpen}
          onSettingsToggle={handleSettingsToggle}
          onBackToMain={handleBackToMain}
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
            {isSettingsOpen ? (
              <Settings />
            ) : (
              <>
                <SearchBar onSearchChange={setSearchTerm} />
                <CategoryTabs />
                <ProductGrid searchTerm={searchTerm} />
              </>
            )}
          </MainContent>
        </div>
      </div>
    </>
  );
}
