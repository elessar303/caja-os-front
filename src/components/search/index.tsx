import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Input, Wrapper, SearchIcon } from "./styled";

interface SearchBarProps {
  onSearchChange: (searchTerm: string) => void;
}

export default function SearchBar({ onSearchChange }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <Wrapper>
      <SearchIcon>
        <FaSearch />
      </SearchIcon>
      <Input
        type="text"
        placeholder="Buscar productos por nombre, código o barcode..."
        value={searchTerm}
        onChange={handleChange}
      />
    </Wrapper>
  );
}
