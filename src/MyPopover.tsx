import {
  Table,
  Text,
  Portal,
  Dialog,
  CloseButton,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import type { Category, Transaction } from "./components/types/myregister.ts";
import { useEffect, useState } from "react";
import { useAuth } from "./utils/useAuth.tsx";
import { fetchWithAuth } from "./utils/fetchWithAuth.tsx";

type MyPopoverProps = {
  isPopoverOpen: boolean;
  setIsPopoverOpen: (open: boolean) => void;
  categories: Category[];
  clickedCategoryId: string;
  clickedMonthIdx: number;
};

export default function MyPopover({
  isPopoverOpen,
  setIsPopoverOpen,
  categories,
  clickedCategoryId,
  clickedMonthIdx,
}: MyPopoverProps) {
  const [popoverTransaction, setPopoverTransaction] = useState<Transaction[]>(
    []
  );
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
                                    ? `${category.name}（削除済み）`
                                    : category.name;
                                })()}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {tx.memo}
                              </Text>
                            </Table.Cell>
                            <Table.Cell>{tx.amount}円</Table.Cell>
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
    </>
  );
}
