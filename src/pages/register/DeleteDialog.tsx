import type { Category, Transaction } from "@/types/myregister";
import { deleteWithAuth } from "@/utils/deleteWithAuth";
import { useAuth } from "@/utils/useAuth";
import {
  Button,
  CloseButton,
  DataList,
  Dialog,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

type DeleteDialogProps = {
  categories: Category[];
  deleteTarget: Transaction;
  isOpenDeleteAlert: boolean;
  setIsOpenDeleteAlert: (isOpenDeleteAlert: boolean) => void;
  deleteTransaction: (id: string) => void;
};

export default function DeleteDialog({
  categories,
  deleteTarget,
  isOpenDeleteAlert,
  setIsOpenDeleteAlert,
  deleteTransaction,
}: DeleteDialogProps) {
  const [deleteLoading, setdeleteLoading] = useState<boolean>(false);
  const { onLogout } = useAuth();

  const formattedDeleteTarget = useMemo(() => {
    if (!deleteTarget) return null;
    return [
      { label: "日付", value: deleteTarget.date, color: "black" },
      {
        label: "カテゴリー",
        value: categories.find((cat) => cat.id === deleteTarget.categoryId)
          ?.name,
        color: deleteTarget.type === "income" ? "#60A5FA" : "#F87171",
      },
      { label: "金額", value: deleteTarget.amount, color: "black" },
      {
        label: "メモ",
        value: deleteTarget.memo ? deleteTarget.memo : "なし",
        color: "black",
      },
    ];
  }, [deleteTarget, categories]);

  const deleteTransactionFromList = async (tx: Transaction | null) => {
    if (!tx) return;
    try {
      setdeleteLoading(true);
      await deleteWithAuth(`/transactions/${tx.id}`);
      deleteTransaction(tx.id);
    } catch (err) {
      console.error(err);
      onLogout();
    } finally {
      setIsOpenDeleteAlert(false);
      setdeleteLoading(false);
    }
  };

  return (
    <Dialog.Root
      role="alertdialog"
      open={isOpenDeleteAlert}
      onOpenChange={(details) => setIsOpenDeleteAlert(details.open)}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="4xl" width="70%">
            <Dialog.Header>
              <Dialog.Title>本当に削除しますか？</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <DataList.Root orientation="horizontal">
                {formattedDeleteTarget?.map((item) => (
                  <DataList.Item key={item.label}>
                    <DataList.ItemLabel fontWeight="bold">
                      {item.label}
                    </DataList.ItemLabel>

                    <DataList.ItemValue color={item.color} w="100%">
                      <Text whiteSpace="normal" wordBreak="break-word">
                        {item.value}
                      </Text>
                    </DataList.ItemValue>
                  </DataList.Item>
                ))}
              </DataList.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button rounded="3xl" variant="outline">
                  キャンセル
                </Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="red"
                rounded="3xl"
                onClick={() => deleteTransactionFromList(deleteTarget)}
                loading={deleteLoading}
                loadingText="削除中"
              >
                削除
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
