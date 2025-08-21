import React, { useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Input,
  Select,
  VStack,
  Field,
  createListCollection,
} from "@chakra-ui/react";

type Category = {
  id: string;
  name: string;
  color: string;
  type: string;
};

type CategoryProps = {
  categories: Category[];
  id: string;
  currentName: string;
  currentColor: string;
  currentType: string;
  isOpen: boolean;
  // onClose: () => void;
  onUpdated: (updatedCategory: Category) => void;
};

const CategoriesEditModal = ({
  categories,
  id,
  currentName,
  currentColor,
  currentType,
  isOpen,
  // onClose,
  onUpdated,
}: CategoryProps) => {
  const [name, setName] = useState(currentName);
  const [color, setColor] = useState(currentColor);
  const [type, setType] = useState(currentType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (categories.some((cat) => cat.name === name)) {
      alert("同じ名前のカテゴリが存在します");
      // setLoading(false);
      return;
    }
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color, type }),
      });
      if (!res.ok) throw new Error("更新失敗");

      const updatedCategory = { id, name, color, type };
      onUpdated(updatedCategory);
      // onClose();
    } catch (err) {
      console.error(err);
      alert("取引更新に失敗しました");
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => !details.open}>
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>カテゴリーを編集</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack>
                <Field.Root>
                  <Field.Label>カテゴリー名</Field.Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="カテゴリー名を入力"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>色</Field.Label>
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </Field.Root>

                <Field.Root>
                  <Select.Root
                    collection={types}
                    value={[type]}
                    onValueChange={(item) => setType(item.value[0])}
                  >
                    <Select.HiddenSelect />
                    <Select.Label>種類</Select.Label>
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="収入" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {types.items.map((type) => (
                            <Select.Item item={type} key={type.value}>
                              {type.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Field.Root>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              {/* <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onClose}>
                  キャンセル
                </Button>
              </Dialog.ActionTrigger> */}
              <Button onClick={handleSubmit}>保存</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

const types = createListCollection({
  items: [
    { value: "income", label: "収入" },
    { value: "expense", label: "支出" },
  ],
});

export default CategoriesEditModal;

// // 簡易スタイル
// const modalOverlay: React.CSSProperties = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100vw",
//   height: "100vh",
//   backgroundColor: "rgba(0,0,0,0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
// };

// const modalContent: React.CSSProperties = {
//   backgroundColor: "#fff",
//   padding: "1rem",
//   borderRadius: "4px",
//   minWidth: "300px",
// };
