import { useState } from "react";
import { Box, Button, Card, Flex } from "@chakra-ui/react";
import CategoriesList from "./CategoriesList.tsx";
import DeletedCategoriesList from "./DeletedCategoriesList.tsx";
import { fetchWithAuth } from "@/utils/fetchWithAuth.tsx";
import { putWithAuth } from "@/utils/putWithAuth.tsx";
import { AiFillEdit } from "react-icons/ai";
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

type categoriesListProps = {
  isLoadingCategories: boolean;
  categories: CategoryType[];
  setCategories: (
    category: CategoryType[] | ((prev: CategoryType[]) => CategoryType[])
  ) => void;
};

export default function ActiveCategoriesList({
  isLoadingCategories,
  categories,
  setCategories,
}: categoriesListProps) {
  const [isDeletedCategoriesDialogOpen, setIsDeletedCategoriesDialogOpen] =
    useState<boolean>(false);

  const deactiveCategory = async (category: CategoryType) => {
    let numTransactionsSpecifiedCategory = 0;
    try {
      const data = await fetchWithAuth(
        `/transactions?categoryId=${category.id}`
      );
      numTransactionsSpecifiedCategory = data.length;
    } catch (error) {
      console.error("Error fetching category details:", error);
      return;
    }

    if (
      !confirm(
        `"${category.name}" には ${numTransactionsSpecifiedCategory} 件の登録があります．\n本当に削除しますか？`
      )
    )
      return;

    try {
      const deletedCategory = await putWithAuth(
        `/categories/${category.id}/delete`,
        category
      );
      const updatedCategories = categories.map((cat) => {
        if (cat.id === deletedCategory.id) {
          cat.is_deleted = true;
        }
        return cat;
      });
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const UpdateCategory = (updatedCategory: CategoryType) => {
    setCategories((prev: CategoryType[]) => {
      const updatedCategories = prev.map((cat) => {
        return cat.id === updatedCategory.id ? updatedCategory : cat;
      });
      return sortCategories(updatedCategories);
    });
  };

  const handleDeletedCategoriesClicked = () => {
    setIsDeletedCategoriesDialogOpen(true);
  };

  return (
    <>
      <Card.Root variant="outline" size="sm" p={4}>
        <Card.Header>
          <Flex justify="space-between" align="center">
            <Card.Title>カテゴリ一覧</Card.Title>
            <Button
              size="xs"
              variant="outline"
              onClick={handleDeletedCategoriesClicked}
            >
              削除済みを表示
            </Button>
          </Flex>
        </Card.Header>
        <Card.Body>
          <Box p={2}>
            <CategoriesList
              isLoadingCategories={isLoadingCategories}
              categories={categories.filter((cat) => !cat.is_deleted)}
              handleDelete={deactiveCategory}
              positiveButtonText="修正"
              positiveButtonIcon={<AiFillEdit />}
              UpdateCategory={UpdateCategory}
              ButtonText="更新"
              ButtonLoadingText="更新中..."
            />
          </Box>
        </Card.Body>
      </Card.Root>

      {isDeletedCategoriesDialogOpen && (
        <DeletedCategoriesList
          isDeletedCategoriesDialogOpen={isDeletedCategoriesDialogOpen}
          handleDeletedCategoriesDialogClose={() =>
            setIsDeletedCategoriesDialogOpen(false)
          }
          categories={categories}
          setCategories={setCategories}
        />
      )}
    </>
  );
}
