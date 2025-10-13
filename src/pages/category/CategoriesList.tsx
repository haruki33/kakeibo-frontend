import { useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  IconButton,
  Portal,
  Table,
  Text,
  Card,
  Box,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import type { Category } from "../../types/mysetting.ts";
import { MdRestoreFromTrash } from "react-icons/md";
import CategoriesForm from "./CategoriesForm.tsx";
import { putWithAuth } from "@/utils/putWithAuth.tsx";
import { fetchWithAuth } from "@/utils/fetchWithAuth.tsx";

type categoriesListProps = {
  isLoadingCategories: boolean;
  categories: Category[];
  updateCategories: (category: Category) => void;
  deleteCategories: (id: string) => void;
};

export default function CategoriesList({
  isLoadingCategories,
  categories,
  updateCategories,
  deleteCategories,
}: categoriesListProps) {
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeletedCategoriesDialogOpen, setIsDeletedCategoriesDialogOpen] =
    useState<boolean>(false);

  const deleteCategory = async (category: Category) => {
    let numTransactionsSpecifiedCategory = 0;
    try {
      const data = await fetchWithAuth(
        `/transactions?categoryId=${category.id}`
      );
      console.log(data);

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
      updateCategories(deletedCategory);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const deleteDeletedCategory = async (category: Category) => {
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
      deleteCategories(category.id);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEditClick = (cat: Category) => {
    setEditCategory(cat);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditCategory(null);
    setIsEditDialogOpen(false);
  };

  const handleDeletedCategoriesDialogClose = () => {
    setIsDeletedCategoriesDialogOpen(false);
  };

  const handleDisplayDeletedClick = () => {
    setIsDeletedCategoriesDialogOpen(true);
  };

  return (
    <>
      <Card.Root
        variant="outline"
        h={{ base: "55vh", md: "80vh" }}
        w={{ base: "full", md: "60vw" }}
        minH="300px"
        size="sm"
      >
        <Card.Body>
          <Flex justify="space-between" pb="4" align="center">
            <Card.Title>カテゴリ一覧</Card.Title>
            <Box flex="1" />
            <Button
              size="xs"
              variant="outline"
              onClick={handleDisplayDeletedClick}
            >
              削除済みを表示
            </Button>
          </Flex>
          {isLoadingCategories ? (
            <Flex justify="center" align="center" h="100%">
              <Spinner color="blue.500" animationDuration="0.8s" />
            </Flex>
          ) : (
            <Box maxH={{ base: "45vh", md: "70vh" }} overflowY="auto">
              <Table.Root>
                <Table.Body>
                  {categories
                    .filter((cat) => !cat.is_deleted)
                    .map((cat) => (
                      <Table.Row key={cat.id}>
                        <Table.Cell textAlign={"left"}>
                          <Text
                            color={
                              cat.type === "income" ? "#60A5FA" : "#F87171"
                            }
                          >
                            {cat.name}
                          </Text>
                          {cat.description?.length > 0 && (
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              whiteSpace="pre-line"
                            >
                              {cat.description.replace(/(.{20})/g, "$1\n")}
                            </Text>
                          )}
                        </Table.Cell>

                        <Table.Cell>
                          <Flex
                            flexDirection={"row"}
                            justifyContent={"flex-end"}
                          >
                            <IconButton
                              color="green"
                              variant="ghost"
                              onClick={() => handleEditClick(cat)}
                            >
                              <AiFillEdit />
                            </IconButton>

                            <IconButton
                              color="#F87171"
                              variant="ghost"
                              onClick={() => deleteCategory(cat)}
                            >
                              <AiFillDelete />
                            </IconButton>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </Card.Body>
      </Card.Root>

      {isEditDialogOpen && editCategory && (
        <Dialog.Root
          open={isEditDialogOpen}
          onOpenChange={handleEditDialogClose}
          placement="center"
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
                <Dialog.Header>
                  <Dialog.Title>カテゴリー編集</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <CategoriesForm
                    categories={categories}
                    defaultValues={editCategory}
                    handleCategory={async (data: Category) => {
                      const res = await putWithAuth(
                        `/categories/${data?.id}`,
                        data
                      );
                      updateCategories(res);
                      handleEditDialogClose();
                    }}
                    formTitle="カテゴリ編集"
                    submitButtonText="更新"
                    loadingText="更新中..."
                    useCard={false}
                  />
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      )}

      <Dialog.Root
        open={isDeletedCategoriesDialogOpen}
        onOpenChange={(details) => {
          if (!details.open) {
            handleDeletedCategoriesDialogClose();
          }
        }}
        placement="center"
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
              <Dialog.Body>
                <Table.Root>
                  <Table.Body>
                    {categories
                      .filter((cat) => cat.is_deleted)
                      .map((cat) => (
                        <Table.Row key={cat.id}>
                          <Table.Cell textAlign={"left"}>
                            <Text
                              color={
                                cat.type === "income" ? "#60A5FA" : "#F87171"
                              }
                            >
                              {cat.name}
                            </Text>
                            {cat.description?.length > 0 && (
                              <Text
                                fontSize="xs"
                                color="gray.500"
                                whiteSpace="pre-line"
                              >
                                {cat.description.replace(/(.{20})/g, "$1\n")}
                              </Text>
                            )}
                          </Table.Cell>

                          <Table.Cell>
                            <Flex
                              flexDirection={"row"}
                              justifyContent={"flex-end"}
                            >
                              <IconButton color="green" variant="ghost">
                                <MdRestoreFromTrash />
                              </IconButton>
                              <IconButton
                                color="#F87171"
                                variant="ghost"
                                onClick={() => deleteDeletedCategory(cat)}
                              >
                                <AiFillDelete />
                              </IconButton>
                            </Flex>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table.Root>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
