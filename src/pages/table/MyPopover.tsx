import {
  Text,
  Portal,
  Dialog,
  CloseButton,
  Flex,
  Spinner,
  IconButton,
  ScrollArea,
  Center,
  VStack,
  Box,
  Separator,
} from "@chakra-ui/react";
import type { Category, Transaction } from "../../types/myregister.ts";
import { useEffect, useState } from "react";
import { useAuth } from "../../utils/useAuth.tsx";
import { fetchWithAuth } from "../../utils/fetchWithAuth.tsx";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import TransactionsForm from "../register/TransactionsForm.tsx";
import { putWithAuth } from "@/utils/putWithAuth.tsx";
import DeleteDialog from "../register/DeleteDialog.tsx";

type MyPopoverProps = {
  isPopoverOpen: boolean;
  setIsPopoverOpen: (open: boolean) => void;
  categories: Category[];
  clickedCategoryId: string;
  clickedMonthIdx: number;
  setIsUpdatingTransactionInTable: (
    isUpdatingTransactionInTable: boolean,
  ) => void;
};

const formatDate = (data: Transaction[]) => {
  return data.map((tx) => ({
    ...tx,
    date: new Date(tx.date).toLocaleString("ja-JP").split(" ")[0],
  }));
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
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onLogout } = useAuth();

  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const RefreshTable = (id: string) => {
    if (!id) return;
    setIsDialogOpen(false);
    setIsUpdatingTransactionInTable(true);
  };

  useEffect(() => {
    const loadClickedCellTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWithAuth(
          `/transactions/${clickedCategoryId}/${clickedMonthIdx + 1}`,
        );
        const formattedDate = formatDate(data);
        setPopoverTransaction(formattedDate);
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
            <Dialog.Content borderRadius={30} width="90%" h="60vh">
              <Dialog.CloseTrigger asChild>
                <CloseButton />
              </Dialog.CloseTrigger>
              <Dialog.Header>
                <Dialog.Title>
                  {clickedMonthIdx + 1}月の
                  {categories.find((cat) => cat.id === clickedCategoryId)?.name}
                  の詳細記録
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body
                borderRadius={30}
                display="flex"
                flexDirection="column"
                p={0}
                minH={0}
              >
                {isLoading ? (
                  <Center borderRadius={30} h="100%">
                    <VStack colorPalette="gray.400">
                      <Spinner color="gray.400" />
                      <Text color="colorPalette.600">Loading...</Text>
                    </VStack>
                  </Center>
                ) : popoverTransaction.length === 0 ? (
                  <Center borderRadius={30} h="100%">
                    <Text color="gray.400" fontWeight="bold">
                      記録がありません
                    </Text>
                  </Center>
                ) : (
                  <ScrollArea.Root flex={1} p="0.5rem 1rem" variant="always">
                    <ScrollArea.Viewport>
                      <ScrollArea.Content>
                        {popoverTransaction.map((tx) => (
                          <Box>
                            <Flex justify="space-between">
                              <Box
                                flex={1}
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                justifyContent="center"
                                height="60px"
                                maxW="30%"
                                color={tx.memo ? "black" : "gray.400"}
                              >
                                <Text
                                  whiteSpace="normal"
                                  wordBreak="break-word"
                                >
                                  {(() => {
                                    const category = categories.find(
                                      (c) => c.id === tx.categoryId,
                                    );
                                    if (!category) return "";
                                    if (!tx.memo) return "メモがありません";
                                    return category.is_deleted === true
                                      ? `${tx.memo}（削除済み）`
                                      : tx.memo;
                                  })()}
                                </Text>
                              </Box>
                              <Box
                                flex={1}
                                display="flex"
                                alignItems="center"
                                justifyContent="flex-end"
                                height="60px"
                              >
                                {tx.amount} 円
                              </Box>
                              <Box
                                flex={1}
                                display="flex"
                                alignItems="center"
                                justifyContent="right"
                                height="60px"
                              >
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
                                  onClick={() => {
                                    setDeleteTarget(tx);
                                    setIsOpenDeleteAlert(true);
                                  }}
                                >
                                  <AiFillDelete />
                                </IconButton>
                              </Box>
                            </Flex>
                            <Separator color="gray.300" />
                          </Box>
                        ))}
                      </ScrollArea.Content>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar>
                      <ScrollArea.Thumb />
                    </ScrollArea.Scrollbar>
                    <ScrollArea.Corner />
                  </ScrollArea.Root>
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

      {isOpenDeleteAlert && deleteTarget && (
        <DeleteDialog
          categories={categories}
          deleteTarget={deleteTarget}
          isOpenDeleteAlert={isOpenDeleteAlert}
          setIsOpenDeleteAlert={setIsOpenDeleteAlert}
          deleteTransaction={RefreshTable}
        />
      )}
    </>
  );
}
