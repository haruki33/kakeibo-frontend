import { useState } from "react";
import {
  Box,
  Button,
  CloseButton,
  createListCollection,
  Dialog,
  Field,
  HStack,
  IconButton,
  Input,
  Portal,
  Select,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

type Category = {
  id: string;
  name: string;
  color: string;
  type: string;
};

type categoriesListProps = {
  categories: Category[];
  deleteCategories: (categoryId: string) => void;
  updateCategories: (category: Category) => void;
};

export default function CategoriesList({
  categories,
  deleteCategories,
  updateCategories,
}: categoriesListProps) {
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  const deleteCategory = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");

      deleteCategories(id);
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

    if (categories.some((cat) => cat.name === editTarget.name)) {
      alert("同じ名前のカテゴリが存在します");
      return;
    }
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/categories/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editTarget.name,
          color: editTarget.color,
          type: editTarget.type,
        }),
      });
      if (!res.ok) throw new Error("更新失敗");

      updateCategories(editTarget);
    } catch (err) {
      console.error(err);
      alert("取引更新に失敗しました");
    }
  };

  return (
    <div>
      <Stack>
        {categories.map((cat) => (
          <Box key={cat.id}>
            <HStack>
              {cat.name} ({cat.type})
              <HStack flex={1} justify="flex-end">
                <Dialog.Root
                  onOpenChange={(open) =>
                    open ? setEditTarget(cat) : setEditTarget(null)
                  }
                >
                  <Dialog.Trigger asChild>
                    <IconButton color="green" variant="ghost">
                      <AiFillEdit />
                    </IconButton>
                  </Dialog.Trigger>

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
                                    prev
                                      ? { ...prev, name: e.target.value }
                                      : null
                                  )
                                }
                                placeholder="カテゴリー名を入力"
                              />
                            </Field.Root>

                            <Field.Root>
                              <Field.Label>色</Field.Label>
                              <Input
                                type="color"
                                value={editTarget ? editTarget.color : ""}
                                onChange={(e) =>
                                  setEditTarget((prev) =>
                                    prev
                                      ? { ...prev, color: e.target.value }
                                      : null
                                  )
                                }
                              />
                            </Field.Root>

                            <Field.Root>
                              <DialogSelect />
                            </Field.Root>
                          </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Button
                            colorPalette="green"
                            onClick={(e) => handleSubmit(e)}
                          >
                            保存
                          </Button>
                        </Dialog.Footer>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>

                <IconButton
                  color="red"
                  variant="ghost"
                  onClick={() => deleteCategory(cat.id)}
                >
                  <AiFillDelete />
                </IconButton>
              </HStack>
            </HStack>
          </Box>
        ))}
      </Stack>
    </div>
  );

  function DialogSelect() {
    return (
      <Select.Root
        collection={types}
        size="sm"
        onValueChange={(e) =>
          setEditTarget((prev) => (prev ? { ...prev, type: e.value[0] } : null))
        }
        defaultValue={editTarget ? [editTarget.type] : []}
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
