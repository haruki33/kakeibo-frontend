import { useState } from "react";
import {
  Card,
  createListCollection,
  Field,
  Input,
  Portal,
  Select,
  Stack,
} from "@chakra-ui/react";
import type { Category, AddCategory } from "../../types/mysetting.ts";
import { useAuth } from "../../utils/useAuth.tsx";
import { postWithAuth } from "../../utils/postWithAuth.tsx";
import PositiveButton from "@/components/PositiveButton.tsx";

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
  const [loading, setLoading] = useState<boolean>(false);
  const { onLogout } = useAuth();

  const handleSubmit = async () => {
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

    const postCategory = async () => {
      try {
        const data = await postWithAuth("/categories", newCategory);
        addCategories(data);
      } catch (err) {
        console.error(err);
        onLogout();
      } finally {
        setName("給料");
        setType("income");
        setDescription("");
        setLoading(false);
      }
    };

    postCategory();
  };

  return (
    <>
      <Card.Root
        variant="outline"
        h={{ base: "42vh", md: "50vh" }}
        w={{ base: "full", md: "60vw" }}
        size="sm"
      >
        <Card.Header pb="4">
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
          <PositiveButton
            loading={loading}
            onClick={handleSubmit}
            loadingText="登録中..."
            buttonText="登録"
          />
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
