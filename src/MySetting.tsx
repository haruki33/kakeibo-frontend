import { useState, useEffect } from "react";
import CategoriesForm from "./CategoriesForm";
import CategoriesList from "./CategoriesList";
import { Stack } from "@chakra-ui/react";

import type { Category } from "./components/types/mysetting.ts";

function MySetting() {
  const [categories, setCategories] = useState<Category[]>([]);

  const addCategories = (newCategories: Category) => {
    setCategories((prev: Category[]) => [...prev, newCategories]);
  };

  const deleteCategories = (categoryId: string) => {
    setCategories((prev: Category[]) =>
      prev.filter((cat) => cat.id !== categoryId)
    );
  };

  const updatedCategory = (updatedCategory: Category) => {
    setCategories((prev: Category[]) =>
      prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
  };

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    fetch(`${baseUrl}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((e) => {
        console.error("Failed to fetch categories", e);
      });
  }, []);

  return (
    <>
      <Stack
        gap="4"
        p="4"
        direction={{ base: "column", md: "row" }}
        maxW="800px"
        mx="auto"
      >
        <CategoriesForm categories={categories} addCategories={addCategories} />
        <CategoriesList
          categories={categories}
          updateCategories={updatedCategory}
          deleteCategories={deleteCategories}
        />
      </Stack>
    </>
  );
}

export default MySetting;
