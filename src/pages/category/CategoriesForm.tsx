import { useState } from "react";
import {
  Button,
  Card,
  createListCollection,
  Field,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import type { Category } from "../../types/mysetting.ts";
import { useAuth } from "../../utils/useAuth.tsx";
import { Controller, useForm } from "react-hook-form";

type CategoriesFormProps = {
  categories: Category[];
  defaultValues: Category;
  handleCategory: (data: Category) => Promise<void>;
  formTitle: string;
  submitButtonText: string;
  loadingText: string;
  useCard: boolean;
};

export default function CategoriesForm({
  categories,
  handleCategory,
  defaultValues,
  formTitle,
  submitButtonText,
  loadingText,
  useCard,
}: CategoriesFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { onLogout } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Category>({
    defaultValues,
  });

  const onsubmit = async (data: Category) => {
    setLoading(true);

    try {
      await handleCategory(data);
    } catch (err) {
      console.error(err);
      onLogout();
    } finally {
      setLoading(false);
    }
  };

  const DialogTypesSelect = () => {
    return (
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Select.Root
            collection={types}
            name={field.name}
            value={[field.value]}
            onValueChange={(e) => field.onChange(e.value[0])}
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
          </Select.Root>
        )}
      />
    );
  };

  const formContent = (
    <form onSubmit={handleSubmit(onsubmit)} noValidate>
      <Stack w="full">
        <Field.Root invalid={!!errors.name}>
          <Field.Label>カテゴリー名</Field.Label>
          <Input
            variant="outline"
            placeholder="（例）副業の収入"
            {...register("name", {
              required: "カテゴリー名は必須です",
              validate: (value, formValues) => {
                const filteredCategoriesWithType = categories.filter((cat) => {
                  return cat.type === formValues.type;
                });
                const existCategory = filteredCategoriesWithType.filter(
                  (cat) => {
                    return cat.name === value;
                  }
                );
                const canSave =
                  existCategory.length === 0 ||
                  existCategory[0].id === formValues.id
                    ? true
                    : false;
                return canSave
                  ? true
                  : `${
                      formValues.type === "income" ? "収入" : "支出"
                    }内に${value}は既に存在します`;
              },
            })}
          />
          <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root>
          <DialogTypesSelect />
        </Field.Root>

        <Field.Root>
          <Field.Label>説明</Field.Label>
          <Input
            placeholder="（例）副業の収入"
            variant="outline"
            {...register("description")}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>登録日</Field.Label>
          <Input
            type="number"
            variant="outline"
            {...register("registration_date")}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>金額</Field.Label>
          <Input type="number" variant="outline" {...register("amount")} />
        </Field.Root>
      </Stack>

      <Button
        type="submit"
        loading={loading}
        colorPalette="green"
        variant="solid"
        loadingText={loadingText}
        w="full"
        mt={8}
      >
        {submitButtonText}
      </Button>
    </form>
  );

  if (useCard) {
    return (
      <Card.Root variant="outline" size="sm" w={{ base: "90vw", md: "30vw" }}>
        <Card.Header mb={4}>
          <Card.Title>{formTitle}</Card.Title>
        </Card.Header>
        <Card.Body>{formContent}</Card.Body>
      </Card.Root>
    );
  }

  return formContent;
}

const types = createListCollection({
  items: [
    { value: "income", label: "収入" },
    { value: "expense", label: "支出" },
  ],
});
