import React, { useState } from "react";
import {
  Button,
  Card,
  createListCollection,
  Field,
  Input,
  Portal,
  Select,
  Stack,
} from "@chakra-ui/react";
import type { Category, AddCategory } from "./components/types/mysetting.ts";

type CategoriesFormProps = {
  categories: Category[];
  addCategories: (category: Category) => void;
};

export default function CategoriesForm({
  categories,
  addCategories,
}: CategoriesFormProps) {
  const [name, setName] = useState<string>("給料");
  const [type, setType] = useState<string>("income");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (categories.some((cat) => cat.name === name)) {
      alert("同じ名前のカテゴリが存在します");
      setLoading(false);
      return;
    }

    const newCategory: AddCategory = {
      name,
      type,
      description,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
      if (!res.ok) {
        throw new Error("Failed to create category");
      }

      const createdCategory = await res.json();
      addCategories(createdCategory);
      setName("給料");
      setType("income");
      setDescription("");
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Card.Root
        variant="outline"
        h={{ base: "40vh", md: "50vh" }}
        w={{ base: "full", md: "60vw" }}
        // minH="500px"
        size="sm"
      >
        <Card.Header>
          <Card.Title>カテゴリー追加</Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field.Root>
              <Field.Label>項目名</Field.Label>
              <Input
                variant="outline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field.Root>

            <Field.Root>
              <Select.Root
                collection={types}
                value={[type]}
                onValueChange={(e) => setType(e.value[0])}
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

            <Field.Root>
              <Field.Label>説明</Field.Label>
              <Input
                variant="outline"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Field.Root>
          </Stack>
        </Card.Body>
        <Card.Footer>
          <Button
            colorPalette="green"
            type="submit"
            onClick={(e) => handleSubmit(e)}
            w="full"
          >
            登録
          </Button>
        </Card.Footer>
      </Card.Root>
    </>
  );
}

const types = createListCollection({
  items: [
    { value: "income", label: "収入" },
    { value: "expense", label: "支出" },
  ],
});
