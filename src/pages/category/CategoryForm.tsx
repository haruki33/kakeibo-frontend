import { useState } from "react";
import {
  Button,
  createListCollection,
  Field,
  Input,
  Stack,
} from "@chakra-ui/react";
import type { typeSelect } from "../../types/mysetting.ts";
import { useAuth } from "../../utils/useAuth.tsx";
import { useForm } from "react-hook-form";
import FormSelect from "../../components/FormSelect.tsx";

type CategoryType = {
  id: string;
  name: string;
  type: "income" | "expense";
  is_deleted: boolean;
  description: string;
  registration_date: string | null;
  amount: string | null;
};

type CategoriesFormProps = {
  categories: CategoryType[];
  defaultValues: CategoryType;
  handleCategory: (data: CategoryType) => Promise<void>;
  submitButtonText: string;
  loadingText: string;
};

const types = createListCollection<typeSelect>({
  items: [
    { value: "income", label: "収入" },
    { value: "expense", label: "支出" },
  ],
});

const dates = createListCollection<typeSelect>({
  items: [
    { value: "", label: "登録日なし" },
    ...Array.from({ length: 31 }, (_, i) => ({
      value: `${i + 1}`,
      label: `${i + 1}日`,
    })),
  ],
});

export default function CategoryForm({
  categories,
  handleCategory,
  defaultValues,
  submitButtonText,
  loadingText,
}: CategoriesFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { onLogout } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CategoryType>({
    defaultValues,
  });
  const registrationDate = watch("registration_date");

  const onsubmit = async (data: CategoryType) => {
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

  return (
    <form onSubmit={handleSubmit(onsubmit)} noValidate>
      <Stack>
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
          <FormSelect
            name="type"
            control={control}
            collections={types}
            label="種類"
            placeholder="収入"
          />
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
          <FormSelect
            name="registration_date"
            control={control}
            collections={dates}
            label="登録日"
            placeholder="登録日なし"
          />
        </Field.Root>

        <Field.Root
          disabled={registrationDate === "" || registrationDate === null}
        >
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
}
