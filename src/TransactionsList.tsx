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
  Text,
  VStack,
} from "@chakra-ui/react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import type { Category, Transaction } from "./components/types/myregister.ts";
import { groupBy } from "es-toolkit";

type TransactionsListProps = {
  categories: Category[];
  transactions: Transaction[];
  selectedDate: string;
  deleteTransaction: (id: string) => void;
  updateTransaction: (updatedTransaction: Transaction) => void;
};

export default function TransactionsList({
  categories,
  transactions,
  selectedDate,
  deleteTransaction,
  updateTransaction,
}: TransactionsListProps) {
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const categoriesCollection = createListCollection({
    items: categories.map((category) => ({
      value: category.id,
      label: category.name,
      category: category.type,
    })),
  });

  const categoriesType = Object.entries(
    groupBy(categoriesCollection.items, (item) => item.category)
  );

  function handleEditClick(tx: Transaction) {
    setEditTarget(tx);
    setIsDialogOpen(true);
  }

  function handleDialogClose() {
    setEditTarget(null);
    setIsDialogOpen(false);
  }

  const deleteTransactionOnList = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/transactions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete transaction");

      deleteTransaction(id);
    } catch (error) {
      console.error("Error deleting transaction:", error);
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
      const res = await fetch(`${baseUrl}/transactions/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: editTarget.date,
          amount: editTarget.amount,
          type: editTarget.type,
          categoryId: editTarget.categoryId,
          memo: editTarget.memo,
        }),
      });
      if (!res.ok) throw new Error("更新失敗");

      updateTransaction(editTarget);
      setIsDialogOpen(false);
      setEditTarget(null);
    } catch (err) {
      console.error(err);
      alert("更新に失敗しました");
    }
  };

  return (
    <div>
      <Table.Root>
        {transactions.filter((tx) => tx.date.slice(0, 10) === selectedDate)
          .length === 0 ? (
          <Table.Body>
            <Table.Row>
              <Table.Cell>取引はありません</Table.Cell>
            </Table.Row>
          </Table.Body>
        ) : (
          <Table.Body>
            {transactions
              .filter((tx) => tx.date.slice(0, 10) === selectedDate)
              .map((tx) => (
                <Table.Row key={tx.id}>
                  <Table.Cell textAlign={"left"}>
                    <Text
                      textStyle="md"
                      fontWeight="medium"
                      color={tx.type === "income" ? "#60A5FA" : "#F87171"}
                    >
                      {categories.find((c) => c.id === tx.categoryId)?.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {tx.memo}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{tx.amount}円</Table.Cell>
                  <Table.Cell textAlign={"right"}>
                    <IconButton
                      color="#F87171"
                      variant="ghost"
                      onClick={() => deleteTransactionOnList(tx.id)}
                    >
                      <AiFillDelete />
                    </IconButton>

                    <IconButton
                      color="green"
                      variant="ghost"
                      onClick={() => handleEditClick(tx)}
                    >
                      <AiFillEdit />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        )}
      </Table.Root>

      <Dialog.Root
        open={isDialogOpen}
        onOpenChange={(details) => {
          if (!details.open) {
            handleDialogClose();
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.CloseTrigger asChild>
                <CloseButton />
              </Dialog.CloseTrigger>
              <Dialog.Header>
                <Dialog.Title>記録の変更</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack>
                  <Field.Root>
                    <Field.Label>日付</Field.Label>
                    <Input
                      type="date"
                      value={editTarget ? editTarget.date.slice(0, 10) : ""}
                      onChange={(e) =>
                        setEditTarget((prev) =>
                          prev ? { ...prev, date: e.target.value } : null
                        )
                      }
                    />
                  </Field.Root>

                  <Field.Root>
                    <DialogCategoriesSelect />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>金額</Field.Label>
                    <Input
                      type="number"
                      value={editTarget ? editTarget.amount : ""}
                      onChange={(e) =>
                        setEditTarget((prev) =>
                          prev
                            ? {
                                ...prev,
                                amount: Number(e.target.value),
                              }
                            : null
                        )
                      }
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>メモ</Field.Label>
                    <Input
                      type="text"
                      value={editTarget ? editTarget.memo : ""}
                      onChange={(e) =>
                        setEditTarget((prev) =>
                          prev ? { ...prev, memo: e.target.value } : null
                        )
                      }
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
    </div>
  );

  function DialogCategoriesSelect() {
    return (
      <Select.Root
        collection={categoriesCollection}
        size="sm"
        onValueChange={(e) => {
          setEditTarget((prev) =>
            prev
              ? { ...prev, categoryId: e.value[0], type: e.items[0].category }
              : null
          );
        }}
        value={editTarget ? [editTarget.categoryId] : []}
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
                {items.map((item) => (
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
