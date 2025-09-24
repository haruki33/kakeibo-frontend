import { useState } from "react";
import {
  CloseButton,
  createListCollection,
  Dialog,
  Field,
  IconButton,
  Input,
  NumberInput,
  Portal,
  Select,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import type { Category, Transaction } from "../../types/myregister.ts";
import { groupBy } from "es-toolkit";
import { useAuth } from "../../utils/useAuth.tsx";
import { deleteWithAuth } from "../../utils/deleteWithAuth.tsx";
import { putWithAuth } from "../../utils/putWithAuth.tsx";
import PositiveButton from "@/components/PositiveButton.tsx";

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
      await deleteWithAuth(`/transactions/${id}`);
      deleteTransaction(id);
    } catch (err) {
      console.error(err);
      onLogout();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!editTarget) {
      alert("編集対象のカテゴリが選択されていません");
      return;
    }

    const { id, ...putTransaction } = editTarget;
    try {
      await putWithAuth(`/transactions/${id}`, putTransaction);
      updateTransaction(editTarget);
    } catch (err) {
      console.error(err);
      onLogout();
    } finally {
      setEditTarget(null);
      setIsDialogOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
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
                      textStyle={{ base: "xs", md: "md" }}
                      fontWeight="medium"
                      color={tx.type === "income" ? "#60A5FA" : "#F87171"}
                    >
                      {(() => {
                        const category = categories.find(
                          (c) => c.id === tx.categoryId
                        );
                        if (!category) return "";
                        return category.is_deleted === true
                          ? `${category.name}（削除済み）`
                          : category.name;
                      })()}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {tx.memo}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{tx.amount}円</Table.Cell>
                  <Table.Cell textAlign={"right"}>
                    <IconButton
                      color="green"
                      variant="ghost"
                      onClick={() => handleEditClick(tx)}
                    >
                      <AiFillEdit />
                    </IconButton>

                    <IconButton
                      color="#F87171"
                      variant="ghost"
                      onClick={() => deleteTransactionOnList(tx.id)}
                    >
                      <AiFillDelete />
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
        placement="center"
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
                    <NumberInput.Root
                      value={
                        editTarget
                          ? String(editTarget.amount).replace(/^0+(?=\d)/, "")
                          : ""
                      }
                      onValueChange={(e) =>
                        setEditTarget((prev) =>
                          prev
                            ? {
                                ...prev,
                                amount: Number(e.value),
                              }
                            : null
                        )
                      }
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
                <PositiveButton
                  loading={loading}
                  onClick={handleSubmit}
                  loadingText="登録中..."
                  buttonText="登録"
                />
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
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
                {items
                  .filter((item) => !item.is_deleted)
                  .map((item, itemIdx) => (
                    <Select.Item item={item} key={itemIdx}>
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
