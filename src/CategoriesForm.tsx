import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  createListCollection,
  Field,
  Input,
  Portal,
  Select,
  Stack,
} from "@chakra-ui/react";
import type { Category } from "./components/types/mysetting.ts";

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (categories.some((cat) => cat.name === name)) {
      alert("同じ名前のカテゴリが存在します");
      setLoading(false);
      return;
    }

    const newCategory: Category = {
      id: uuidv4(),
      name,
      type,
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

      addCategories(newCategory);
      setName("給料");
      setType("income");
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
          <Button colorPalette="green" type="submit">
            登録
          </Button>
        </Stack>
      </form>
    </div>
  );
}

const types = createListCollection({
  items: [
    { value: "income", label: "収入" },
    { value: "expense", label: "支出" },
  ],
});
