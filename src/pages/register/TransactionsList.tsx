import { useState } from "react";
import {
  Box,
  Center,
  Container,
  Flex,
  IconButton,
  ScrollArea,
  Separator,
  Text,
} from "@chakra-ui/react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import type { Category, Transaction } from "../../types/myregister.ts";
import TransactionsForm from "./TransactionsForm.tsx";
import { putWithAuth } from "@/utils/putWithAuth.tsx";
import DeleteDialog from "./DeleteDialog.tsx";

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

  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  function handleEditClick(tx: Transaction) {
    setEditTarget(tx);
    setIsDialogOpen(true);
  }

  return (
    <>
      {transactions.filter((tx) => tx.date.slice(0, 10) === selectedDate)
        .length === 0 ? (
        <Center
          backgroundColor="rgba(160, 174, 192, 0.2)"
          h="27vh"
          borderRadius={30}
        >
          <Text color="gray.400" fontWeight="bold">
            今日は記録がありません
          </Text>
        </Center>
      ) : (
        <Container
          fluid
          backgroundColor="rgba(160, 174, 192, 0.2)"
          borderRadius={30}
        >
          <ScrollArea.Root h="27vh">
            <ScrollArea.Viewport>
              <ScrollArea.Content>
                {transactions
                  .filter((tx) => tx.date.slice(0, 10) === selectedDate)
                  .map((tx) => (
                    <Box>
                      <Flex justify="space-between">
                        <Box
                          flex={1}
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-start"
                          justifyContent="center"
                          height="60px"
                          color={tx.type === "income" ? "#60A5FA" : "#F87171"}
                        >
                          {(() => {
                            const category = categories.find(
                              (c) => c.id === tx.categoryId,
                            );
                            if (!category) return "";
                            return category.is_deleted === true ? (
                              <Text fontWeight="bold">
                                {category.name}（削除済み）
                              </Text>
                            ) : (
                              <Text fontWeight="bold">{category.name}</Text>
                            );
                          })()}
                          <Flex maxW="150px">
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              marginTop={-1}
                              p={0}
                              truncate
                            >
                              {tx.memo}
                            </Text>
                          </Flex>
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
          </ScrollArea.Root>
        </Container>
      )}

      {isDialogOpen && editTarget && (
        <TransactionsForm
          categories={categories}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleTransaction={async (data) => {
            const res = await putWithAuth(
              `/transactions/${editTarget.id}`,
              data,
            );
            updateTransaction(res);
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
          deleteTransaction={deleteTransaction}
        />
      )}
    </>
  );
}
