import { useEffect, useState } from "react";

import Calendar from "./Calendar.tsx";
import TransactionsList from "./TransactionsList.tsx";
import TransactionsForm from "./TransactionsForm.tsx";
import { Box, Button, Card, Dialog, Stack, VStack } from "@chakra-ui/react";

import type { Category, Transaction } from "./components/types/myregister.ts";

function MyRegister() {
  const [selectedYearAndMonth, setSelectedYearAndMonth] = useState(
    `${new Date().toISOString().slice(0, 7)}`
  );
  const [selectedDate, setSelectedDate] = useState(
    `${new Date().toISOString().slice(0, 10)}`
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const addTransaction = (newTransaction: Transaction) => {
    setTransactions((prev: Transaction[]) => [...prev, newTransaction]);
  };

  const deleteTransaction = (transactionId: string) => {
    setTransactions((prev: Transaction[]) =>
      prev.filter((tx) => tx.id !== transactionId)
    );
  };

  const updatedTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev: Transaction[]) =>
      prev.map((tx) =>
        tx.id === updatedTransaction.id ? updatedTransaction : tx
      )
    );
  };

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    fetch(`${baseUrl}/categories`)
      .then((res) => res.json())
      .then((data: Category[]) => {
        setCategories(data);
      })
      .catch((e) => console.error("Failed to fetch categories", e));
  }, []);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    fetch(`${baseUrl}/transactions?month=${selectedYearAndMonth}`)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
      })
      .catch((e) => {
        console.error("Failed to fetch transactions", e);
      });
  }, [selectedYearAndMonth]);

  return (
    <>
      <Stack
        direction={{ base: "column", md: "row" }}
        gap="4"
        p="4"
        w="full"
        justify="center"
      >
        <Card.Root
          h={{ base: "40vh", md: "80vh" }}
          w={{ base: "full", md: "60vw" }}
          minH="400px"
        >
          <Calendar
            setYearAndMonth={setSelectedYearAndMonth}
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
            transactions={transactions}
          />
        </Card.Root>
        <VStack>
          <Card.Root
            h={{ base: "50vh", md: "80vh" }}
            w={{ base: "full", md: "30vw" }}
            minH="400px"
            flex="1"
            size="sm"
          >
            <Card.Body>
              <Card.Title>お金の記録</Card.Title>
              <Box maxH={{ base: "30vh", md: "400px" }} overflowY="auto">
                <TransactionsList
                  categories={categories}
                  transactions={transactions}
                  selectedDate={selectedDate}
                  deleteTransaction={deleteTransaction}
                  updateTransaction={updatedTransaction}
                />
              </Box>
            </Card.Body>
            <Dialog.Root
              open={isDialogOpen}
              onOpenChange={(details) => setIsDialogOpen(details.open)}
              placement="center"
            >
              <Dialog.Trigger asChild>
                <Button m="4" colorPalette="green" variant="solid">
                  新しい取引を追加
                </Button>
              </Dialog.Trigger>
              <TransactionsForm
                categories={categories}
                selectedDate={selectedDate}
                addTransaction={addTransaction}
                setIsDialogOpen={setIsDialogOpen}
              />
            </Dialog.Root>
          </Card.Root>
        </VStack>
      </Stack>
    </>
  );
}

export default MyRegister;
