import {
  Button,
  CloseButton,
  createListCollection,
  Dialog,
  Field,
  Input,
  NumberInput,
  Portal,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import type {
  Category,
  PostTransaction,
  Transaction,
} from "../../types/myregister.ts";
import { groupBy } from "es-toolkit";
import { useAuth } from "../../utils/useAuth.tsx";
import { postWithAuth } from "../../utils/postWithAuth.tsx";
import { Controller, useForm } from "react-hook-form";

type TransactionsFormProps = {
  categories: Category[];
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  selectedDate: string;
  addTransaction: (newTransaction: Transaction) => void;
};

export default function TransactionsForm({
  categories,
  isDialogOpen,
  setIsDialogOpen,
  selectedDate,
  addTransaction,
}: TransactionsFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { onLogout } = useAuth();

  const defaultValues: PostTransaction = {
    date: selectedDate,
    amount: 0,
    type: "",
    categoryId: "",
    memo: "",
  };

  const { register, control, handleSubmit, setValue } =
    useForm<PostTransaction>({
      defaultValues,
    });

  const categoriesCollection = createListCollection({
    items: categories.map((category) => ({
      label: category.name,
      value: category.id,
      type: category.type,
      is_deleted: category.is_deleted,
    })),
  });

  const categoriesType = Object.entries(
    groupBy(categoriesCollection.items, (item) => item.type)
  );

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);

    try {
      const Res = await postWithAuth("/transactions", data);
      addTransaction(Res);
    } catch (error) {
      console.error(error);
      onLogout();
    } finally {
      setIsDialogOpen(false);
      setLoading(false);
    }
  });

  return (
    <Dialog.Root
      open={isDialogOpen}
      onOpenChange={(details) => setIsDialogOpen(details.open)}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <form onSubmit={onSubmit} style={{ width: "80%" }}>
            <Dialog.Content>
              <Dialog.CloseTrigger asChild>
                <CloseButton />
              </Dialog.CloseTrigger>

              <Dialog.Header>
                <Dialog.Title>お金の新規登録</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <VStack gap="4">
                  <Field.Root>
                    <Field.Label>日付</Field.Label>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <Input
                          name={field.name}
                          type="date"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      )}
                    />
                  </Field.Root>

                  <Field.Root>
                    <DialogCategoriesSelect />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>金額</Field.Label>
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <NumberInput.Root
                          name={field.name}
                          value={field.value?.toString() ?? ""}
                          onValueChange={({ value }) => {
                            field.onChange(Number(value));
                          }}
                          minW="100%"
                        >
                          <NumberInput.Control />
                          <NumberInput.Input onBlur={field.onBlur} />
                        </NumberInput.Root>
                      )}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>メモ</Field.Label>
                    <Input placeholder="例）ランチ代" {...register("memo")} />
                  </Field.Root>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  type="submit"
                  loading={loading}
                  colorPalette="green"
                  variant="solid"
                  loadingText="保存中..."
                  w="full"
                >
                  保存
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </form>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );

  function DialogCategoriesSelect() {
    return (
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <Select.Root
            name={field.name}
            value={[field.value]}
            onInteractOutside={() => field.onBlur()}
            collection={categoriesCollection}
            onValueChange={({ value }) => {
              field.onChange(value[0]);
              setValue(
                "type",
                categories.find((cat) => cat.id === value[0])?.type || ""
              );
            }}
          >
            <Select.HiddenSelect />
            <Select.Label>カテゴリー選択</Select.Label>
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
                {categoriesType.map(([category, items]) => (
                  <Select.ItemGroup key={category}>
                    <Select.ItemGroupLabel
                      color={category === "income" ? "#60A5FA" : "#F87171"}
                      fontWeight="bold"
                    >
                      {category === "income" ? "収入" : "支出"}
                    </Select.ItemGroupLabel>
                    {items
                      .filter((item) => !item.is_deleted)
                      .map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                  </Select.ItemGroup>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        )}
      />
    );
  }
}
