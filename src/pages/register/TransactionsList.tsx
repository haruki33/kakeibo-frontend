import { useState } from "react";
import { IconButton, Table, Text } from "@chakra-ui/react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import type { Category, Transaction } from "../../types/myregister.ts";
import { useAuth } from "../../utils/useAuth.tsx";
import { deleteWithAuth } from "../../utils/deleteWithAuth.tsx";
import TransactionsForm from "./TransactionsForm.tsx";
import { putWithAuth } from "@/utils/putWithAuth.tsx";

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
  const { onLogout } = useAuth();

  function handleEditClick(tx: Transaction) {
    setEditTarget(tx);
    setIsDialogOpen(true);
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

      {isDialogOpen && editTarget && (
        <TransactionsForm
          categories={categories}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleTransaction={async (data) => {
            const res = await putWithAuth(
              `/transactions/${editTarget.id}`,
              data
            );
            updateTransaction(res);
          }}
          defaultValues={editTarget}
          formTitle="お金の記録を編集"
          submitButtonText="更新"
          loadingText="更新中..."
        />
      )}
    </>
  );
}
