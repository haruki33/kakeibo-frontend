import { useState, useEffect } from "react";
import CategoriesForm from "./CategoriesForm.tsx";
import CategoriesList from "./CategoriesList.tsx";
import { Stack } from "@chakra-ui/react";

import type { Category } from "../../types/mysetting.ts";
import { useAuth } from "../../utils/useAuth.tsx";
import { fetchWithAuth } from "../../utils/fetchWithAuth.tsx";

function MySetting() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] =
    useState<boolean>(false);
  const { onLogout } = useAuth();

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
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const data = await fetchWithAuth("/categories");
        setCategories(data);
      } catch (err) {
        console.error(err);
        onLogout();
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, [onLogout]);

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
          isLoadingCategories={isLoadingCategories}
          categories={categories}
          updateCategories={updatedCategory}
          deleteCategories={deleteCategories}
        />
      </Stack>
    </>
  );
}

export default MySetting;
