import {
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
import React, { useMemo, useState } from "react";
import type {
  Category,
  PostTransaction,
  Transaction,
} from "../../types/myregister.ts";
import { groupBy } from "es-toolkit";
import { useAuth } from "../../utils/useAuth.tsx";
import { postWithAuth } from "../../utils/postWithAuth.tsx";
import PositiveButton from "@/components/PositiveButton.tsx";

type TransactionsFormProps = {
  categories: Category[];
  selectedDate: string;
  addTransaction: (newTransaction: Transaction) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
};

export default function TransactionsForm({
  categories,
  selectedDate,
  addTransaction,
  setIsDialogOpen,
}: TransactionsFormProps) {
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [amount, setAmount] = useState<string>("0");
  const [type, setType] = useState<string>("expense");
  const [categoryId, setCategoryId] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { onLogout } = useAuth();

  const categoriesCollection = createListCollection({
    items: categories.map((category) => ({
      value: category.id,
      label: category.name,
      category: category.type,
      is_deleted: category.is_deleted,
    })),
  });

  const categoriesType = Object.entries(
    groupBy(categoriesCollection.items, (item) => item.category)
  );

  useMemo(() => {
    setType(categories.find((cat) => cat.id === categoryId)?.type || "expense");
  }, [categories, categoryId]);

  useMemo(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newTransaction: PostTransaction = {
      date,
      amount: Number(amount),
      type,
      categoryId,
      memo,
    };

    try {
      const data = await postWithAuth("/transactions", newTransaction);
      addTransaction(data);
    } catch (err) {
      console.error(err);
      onLogout();
    } finally {
      setIsDialogOpen(false);
      setLoading(false);
    }
  };

  return (
    <div>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
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
                  <Input
                    type="date"
                    value={date ?? ""}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Field.Root>

                <Field.Root>
                  <DialogCategoriesSelect />
                </Field.Root>

                <Field.Root>
                  <Field.Label>金額</Field.Label>
                  <NumberInput.Root
                    value={amount.replace(/^0+(?=\d)/, "")}
                    onValueChange={(e) => setAmount(e.value)}
                    minW="100%"
                    required
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
                  </NumberInput.Root>
                </Field.Root>

                <Field.Root>
                  <Field.Label>メモ</Field.Label>
                  <Input
                    placeholder="例）ランチ代"
                    value={memo ?? ""}
                    onChange={(e) => setMemo(e.target.value)}
                  />
                </Field.Root>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <PositiveButton
                loading={loading}
                onClick={(e) => handleSubmit(e)}
                loadingText="保存中..."
                buttonText="保存"
              />
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </div>
  );

  function DialogCategoriesSelect() {
    return (
      <Select.Root
        collection={categoriesCollection}
        onValueChange={(e) => setCategoryId(String(e.value[0]))}
        value={categoriesCollection.items.map((Item) =>
          Item.value === categoryId ? Item.value : ""
        )}
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
    );
  }
}
