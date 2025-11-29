import { useState, useEffect } from "react";
import CategoriesForm from "./CategoriesForm.tsx";
import CategoriesList from "./CategoriesList.tsx";
import { Stack } from "@chakra-ui/react";

import type { Category } from "../../types/mysetting.ts";
import { useAuth } from "../../utils/useAuth.tsx";
import { fetchWithAuth } from "../../utils/fetchWithAuth.tsx";
import { postWithAuth } from "@/utils/postWithAuth.tsx";

function MySetting() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] =
    useState<boolean>(false);
  const { onLogout } = useAuth();

  const defaultValues = {
    id: "",
    name: "",
    type: "income",
    is_deleted: false,
    description: "",
    registration_date: "",
    amount: "",
  };

  const addCategories = (newCategories: Category) => {
    setCategories((prev: Category[]) => {
      const updatedCategories = [...prev, newCategories];
      return sortCategories(updatedCategories);
    });
  };

  const deleteCategories = (categoryId: string) => {
    setCategories((prev: Category[]) =>
      prev.filter((cat) => cat.id !== categoryId)
    );
  };

  const updatedCategory = (updatedCategory: Category) => {
    setCategories((prev: Category[]) => {
      const updated = prev.map((cat) =>
        cat.id === updatedCategory.id ? updatedCategory : cat
      );
      return sortCategories(updated);
    });
  };

  const sortCategories = (categories: Category[]) => {
    return categories.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "income" ? -1 : 1;
      }
      return a.name.localeCompare(b.name, "ja");
    });
  };

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const data = await fetchWithAuth("/categories");
        setCategories(sortCategories(data));
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
      <Stack direction={{ base: "column", md: "row" }} h="100%" w="100%" p={4}>
        <CategoriesForm
          categories={categories}
          defaultValues={defaultValues}
          handleCategory={async (data: Category) => {
            const res = await postWithAuth("/categories", data);
            addCategories(res);
          }}
          formTitle="カテゴリ追加"
          submitButtonText="追加"
          loadingText="追加中..."
          useCard={true}
        />
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
