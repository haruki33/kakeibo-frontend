import { Card, Flex } from "@chakra-ui/react";
import CategoryForm from "./CategoryForm";
import type { CategoryType } from "../../types/mysetting.ts";
import { postWithAuth } from "@/utils/postWithAuth.tsx";
import { sortCategories } from "./sortCategories.tsx";

type CategoryAddProps = {
  categories: CategoryType[];
  setCategories: (
    category: CategoryType[] | ((prev: CategoryType[]) => CategoryType[])
  ) => void;
};

const defaultValues: CategoryType = {
  id: "",
  name: "",
  type: "income",
  is_deleted: false,
  description: "",
  registration_date: null,
  amount: null,
};

export default function CategoryAdd({
  categories,
  setCategories,
}: CategoryAddProps) {
  const addCategories = (newCategories: CategoryType) => {
    setCategories((prev: CategoryType[]) => {
      const updatedCategories = [...prev, newCategories];
      return sortCategories(updatedCategories);
    });
  };
  return (
    <>
      <Card.Root variant="outline" size="sm" p={4}>
        <Card.Header>
          <Flex justify="space-between" align="center">
            <Card.Title>カテゴリ追加</Card.Title>
          </Flex>
        </Card.Header>
        <Card.Body>
          <CategoryForm
            categories={categories}
            defaultValues={defaultValues}
            handleCategory={async (data: CategoryType) => {
              const res = await postWithAuth("/categories", data);
              addCategories(res);
            }}
            submitButtonText="追加"
            loadingText="追加中..."
          />
        </Card.Body>
      </Card.Root>
    </>
  );
}
