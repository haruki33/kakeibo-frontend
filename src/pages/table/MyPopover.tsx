import {
  Table,
  Text,
  Portal,
  Dialog,
  CloseButton,
  Flex,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import type { Category, Transaction } from "../../types/myregister.ts";
import { useEffect, useState } from "react";
import { useAuth } from "../../utils/useAuth.tsx";
import { fetchWithAuth } from "../../utils/fetchWithAuth.tsx";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import TransactionsForm from "../register/TransactionsForm.tsx";
import { putWithAuth } from "@/utils/putWithAuth.tsx";
import { deleteWithAuth } from "@/utils/deleteWithAuth.tsx";

type MyPopoverProps = {
  isPopoverOpen: boolean;
  setIsPopoverOpen: (open: boolean) => void;
  categories: Category[];
  clickedCategoryId: string;
  clickedMonthIdx: number;
  setIsUpdatingTransactionInTable: (
    isUpdatingTransactionInTable: boolean
  ) => void;
};

export default function MyPopover({
  isPopoverOpen,
  setIsPopoverOpen,
  categories,
  clickedCategoryId,
  clickedMonthIdx,
  setIsUpdatingTransactionInTable,
}: MyPopoverProps) {
  const [popoverTransaction, setPopoverTransaction] = useState<Transaction[]>(
    []
  );
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onLogout } = useAuth();

  useEffect(() => {
    const loadClickedCellTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWithAuth(
          `/transactions/${clickedCategoryId}/${clickedMonthIdx + 1}`
        );
        setPopoverTransaction(data);
      } catch (err) {
        console.error(err);
        onLogout();
      } finally {
        setIsLoading(false);
      }
    };

    loadClickedCellTransactions();
  }, [onLogout, clickedCategoryId, clickedMonthIdx]);

  const handleClose = () => {
    setIsPopoverOpen(false);
  };

  function handleEditClick(tx: Transaction) {
    const editTargetDate = new Date(tx.date);
    const editTargetDateString = [
      editTargetDate.getFullYear(),
      String(editTargetDate.getMonth() + 1).padStart(2, "0"),
      String(editTargetDate.getDate()).padStart(2, "0"),
    ].join("-");
    const editTarget = {
      ...tx,
      date: editTargetDateString,
    };
    setEditTarget(editTarget);
    setIsDialogOpen(true);
  }

  const deleteTransactionOnList = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;
    try {
      await deleteWithAuth(`/transactions/${id}`);
      setIsUpdatingTransactionInTable(true);
    } catch (err) {
      console.error(err);
      onLogout();
    }
  };

  return (
    <>
      <Dialog.Root
        open={isPopoverOpen}
        onOpenChange={(details) => {
          if (!details.open) {
            handleClose();
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
                <Dialog.Title>お金の詳細記録</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {isLoading ? (
                  <Flex justify="center" align="center" h="100%">
                    <Spinner color="blue.500" animationDuration="0.8s" />
                  </Flex>
                ) : (
                  <Table.Root>
                    {popoverTransaction.length === 0 ? (
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>記録はありません</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    ) : (
                      <Table.Body>
                        {popoverTransaction.map((tx) => (
                          <Table.Row key={tx.id}>
                            <Table.Cell textAlign={"left"}>
                              <Text
                                textStyle={{ base: "xs", md: "md" }}
                                fontWeight="medium"
                              >
                                {(() => {
                                  const category = categories.find(
                                    (c) => c.id === tx.categoryId
                                  );
                                  if (!category) return "";
                                  return category.is_deleted === true
                                    ? `${tx.memo}（削除済み）`
                                    : tx.memo;
                                })()}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {(() => {
                                  const dayStr = new Date(
                                    tx.date
                                  ).toLocaleDateString("ja-JP");
                                  return dayStr;
                                })()}
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
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {isDialogOpen && editTarget && (
        <TransactionsForm
          categories={categories}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleTransaction={async (data) => {
            await putWithAuth(`/transactions/${editTarget.id}`, data);
            setIsUpdatingTransactionInTable(true);
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
