import { Dialog, Portal, CloseButton, Box } from "@chakra-ui/react";
import CategoriesList from "./CategoriesList";
import type { CategoryType } from "@/types/mysetting";
import { FaTrashRestore } from "react-icons/fa";
import { putWithAuth } from "@/utils/putWithAuth";

type DeletedCategoriesListProps = {
  isDeletedCategoriesDialogOpen: boolean;
  handleDeletedCategoriesDialogClose: () => void;
  categories: CategoryType[];
  setCategories: (category: CategoryType[]) => void;
};

export default function DeletedCategoriesList({
  isDeletedCategoriesDialogOpen,
  handleDeletedCategoriesDialogClose,
  categories,
  setCategories,
}: DeletedCategoriesListProps) {
  const destroyCategory = async (category: CategoryType) => {
    if (!confirm("完全に削除されます，よろしいですか？")) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/categories/${category.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete category");

      const afterDestroyCategories = categories.filter(
        (cat) => cat.id !== category.id,
      );
      setCategories(afterDestroyCategories);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const restoreCategory = async (category: CategoryType) => {
    try {
      const restoreCategory = await putWithAuth(
        `/categories/${category.id}/restore`,
        category,
      );
      const updatedCategories = categories.map((cat) => {
        return cat.id === restoreCategory.id ? restoreCategory : cat;
      });
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <Dialog.Root
      open={isDeletedCategoriesDialogOpen}
      onOpenChange={(details) => {
        if (!details.open) {
          handleDeletedCategoriesDialogClose();
        }
      }}
      placement="center"
      size="cover"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger asChild>
              <CloseButton />
            </Dialog.CloseTrigger>
            <Dialog.Header>
              <Dialog.Title>削除済みカテゴリ一覧</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body maxH="80vh" overflowY="auto">
              <Box p={2}>
                <CategoriesList
                  isLoadingCategories={false}
                  categories={categories.filter((cat) => cat.is_deleted)}
                  handleDelete={destroyCategory}
                  positiveButtonIcon={<FaTrashRestore />}
                  UpdateCategory={restoreCategory}
                  ButtonText="復活"
                  ButtonLoadingText="復活中..."
                />
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
