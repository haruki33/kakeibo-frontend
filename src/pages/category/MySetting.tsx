import { useState, useEffect } from "react";
import { Container, Tabs } from "@chakra-ui/react";

import { fetchWithAuth } from "../../utils/fetchWithAuth.tsx";
import CategoryAdd from "./CategoryAdd.tsx";
import ActiveCategoriesList from "./ActiveCategoriesList.tsx";
import { sortCategories } from "./sortCategories.tsx";

type CategoryType = {
  id: string;
  name: string;
  type: "income" | "expense";
  is_deleted: boolean;
  description: string;
  registration_date: string | null;
  amount: string | null;
};

function MySetting() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] =
    useState<boolean>(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await fetchWithAuth("/categories");
        setCategories(sortCategories(data));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <>
      <Container p={8}>
        <Tabs.Root defaultValue="add">
          <Tabs.List>
            <Tabs.Trigger value="add">カテゴリー追加</Tabs.Trigger>
            <Tabs.Trigger value="list">カテゴリー一覧</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="add">
            <CategoryAdd
              categories={categories}
              setCategories={setCategories}
            />
          </Tabs.Content>
          <Tabs.Content value="list">
            <ActiveCategoriesList
              isLoadingCategories={isLoadingCategories}
              categories={categories}
              setCategories={setCategories}
            />
          </Tabs.Content>
        </Tabs.Root>
      </Container>
    </>
  );
}

export default MySetting;
