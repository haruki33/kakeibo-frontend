import { useState, useEffect } from "react";
import CategoriesForm from "./CategoriesForm";
import CategoriesList from "./CategoriesList";
import { Card, Stack } from "@chakra-ui/react";

import type { Category } from "./components/types/mysetting.ts";

function Setting() {
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
      <Stack gap="4" p="4" direction="column" maxW="800px" mx="auto">
        <Card.Root variant="outline">
          <Card.Header>
            <Card.Title>カテゴリー追加</Card.Title>
          </Card.Header>
          <Card.Body>
            <CategoriesForm
              categories={categories}
              addCategories={addCategories}
            />
          </Card.Body>
        </Card.Root>
        <Card.Root variant="outline">
          <Card.Header>
            <Card.Title>カテゴリー一覧</Card.Title>
          </Card.Header>
          <Card.Body>
            <CategoriesList
              categories={categories}
              deleteCategories={deleteCategories}
              updateCategories={updatedCategory}
            />
          </Card.Body>
        </Card.Root>
      </Stack>
    </>
  );
}

export default Setting;
