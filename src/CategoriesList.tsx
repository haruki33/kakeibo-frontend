import { useState } from "react";
import {
  Button,
  CloseButton,
  createListCollection,
  Dialog,
  Field,
  IconButton,
  Input,
  Portal,
  Select,
  Table,
  VStack,
  Text,
  Card,
  Box,
  Flex,
} from "@chakra-ui/react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import type { Category } from "./components/types/mysetting.ts";
import { MdRestoreFromTrash } from "react-icons/md";

type categoriesListProps = {
  categories: Category[];
  updateCategories: (category: Category) => void;
  deleteCategories: (id: string) => void;
};

export default function CategoriesList({
  categories,
  updateCategories,
  deleteCategories,
}: categoriesListProps) {
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeletedCategoriesDialogOpen, setIsDeletedCategoriesDialogOpen] =
    useState<boolean>(false);

  const deleteCategory = async (category: Category) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/categories/${category.id}/delete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete category");

      const deletedCategory = await res.json();
      updateCategories(deletedCategory);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editTarget) {
      alert("編集対象のカテゴリが選択されていません");
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/categories/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editTarget.name,
          type: editTarget.type,
          description: editTarget.description,
        }),
      });
      if (!res.ok) throw new Error("更新失敗");

      updateCategories(editTarget);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert("カテゴリ更新に失敗しました");
    }
  };

  const deletedeletedCategory = async (category: Category) => {
    if (!confirm("完全に削除されます，よろしいですか？")) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/categories/${category.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete category");
      deleteCategories(category.id);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEditClick = (cat: Category) => {
    setEditTarget(cat);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditTarget(null);
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
          <Box maxH={{ base: "45vh", md: "70vh" }} overflowY="auto">
            <Table.Root>
              <Table.Body>
                {categories
                  .filter((cat) => !cat.is_deleted)
                  .map((cat) => (
                    <Table.Row key={cat.id}>
                      <Table.Cell textAlign={"left"}>
                        <Text
                          color={cat.type === "income" ? "#60A5FA" : "#F87171"}
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
                        <Flex flexDirection={"row"} justifyContent={"flex-end"}>
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
        </Card.Body>
      </Card.Root>

      <Dialog.Root
        open={isEditDialogOpen}
        onOpenChange={(details) => {
          if (!details.open) {
            handleEditDialogClose();
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
                <Dialog.Title>カテゴリー編集</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack>
                  <Field.Root>
                    <Field.Label>カテゴリー名</Field.Label>
                    <Input
                      value={editTarget ? editTarget.name : ""}
                      onChange={(e) =>
                        setEditTarget((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                      placeholder="カテゴリー名を入力"
                    />
                  </Field.Root>

                  <Field.Root>
                    <DialogSelect />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>説明</Field.Label>
                    <Input
                      value={editTarget ? editTarget.description : ""}
                      onChange={(e) =>
                        setEditTarget((prev) =>
                          prev ? { ...prev, description: e.target.value } : null
                        )
                      }
                      placeholder="説明を入力"
                    />
                  </Field.Root>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button colorPalette="green" onClick={(e) => handleSubmit(e)}>
                  保存
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

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
                                onClick={() => deletedeletedCategory(cat)}
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

  function DialogSelect() {
    return (
      <Select.Root
        collection={types}
        size="sm"
        onValueChange={(e) =>
          setEditTarget((prev) => (prev ? { ...prev, type: e.value[0] } : null))
        }
        value={editTarget ? [editTarget.type] : []}
      >
        <Select.HiddenSelect />
        <Select.Label>収支選択</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="選択" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {types.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    );
  }
}

const types = createListCollection({
  items: [
    { value: "income", label: "収入" },
    { value: "expense", label: "支出" },
  ],
});
