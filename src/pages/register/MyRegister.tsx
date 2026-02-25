import { useEffect, useState } from "react";

import Calendar from "./Calendar.tsx";
import TransactionsList from "./TransactionsList.tsx";
import TransactionsForm from "./TransactionsForm.tsx";
import {
  Card,
  Heading,
  Stack,
  IconButton,
  Center,
  Spinner,
  VStack,
  Text,
} from "@chakra-ui/react";

import type { Category, Transaction } from "../../types/myregister.ts";
import { useAuth } from "../../utils/useAuth.tsx";
import { fetchWithAuth } from "../../utils/fetchWithAuth.tsx";
import { postWithAuth } from "@/utils/postWithAuth.tsx";
import { AiFillPlusCircle } from "react-icons/ai";

function MyRegister() {
  const [selectedYearAndMonth, setSelectedYearAndMonth] = useState(
    `${new Date().toISOString().slice(0, 7)}`,
  );
  const [selectedDate, setSelectedDate] = useState(
    `${new Date().toISOString().slice(0, 10)}`,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoadingTransactions, setIsLoadingTransactions] =
    useState<boolean>(false);
  const { onLogout } = useAuth();

  const defaultValues: Transaction = {
    id: "",
    date: selectedDate,
    amount: 0,
    type: "",
    categoryId: "",
    memo: "",
  };

  const addTransaction = (newTransaction: Transaction) => {
    setTransactions((prev: Transaction[]) => [...prev, newTransaction]);
  };

  const deleteTransaction = (transactionId: string) => {
    setTransactions((prev: Transaction[]) =>
      prev.filter((tx) => tx.id !== transactionId),
    );
  };

  const updatedTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev: Transaction[]) =>
      prev.map((tx) =>
        tx.id === updatedTransaction.id ? updatedTransaction : tx,
      ),
    );
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchWithAuth("/categories");
        setCategories(data);
      } catch (err) {
        console.error(err);
        onLogout();
      }
    };

    loadCategories();
  }, [onLogout]);

  useEffect(() => {
    const loadSelectedTransactions = async () => {
      setIsLoadingTransactions(true);
      try {
        const data = await fetchWithAuth(
          `/transactions?month=${selectedYearAndMonth}`,
        );
        setTransactions(data);
      } catch (err) {
        console.error(err);
        onLogout();
      }
      setIsLoadingTransactions(false);
    };

    loadSelectedTransactions();
  }, [onLogout, selectedYearAndMonth]);

  return (
    <>
      <Stack
        direction={{ base: "column", md: "row" }}
        p="4"
        w="full"
        justify="center"
      >
        <Card.Root
          h={{ base: "45vh", md: "80vh" }}
          w={{ base: "full", md: "60vw" }}
          minH="340px"
          borderRadius={30}
        >
          <Calendar
            setYearAndMonth={setSelectedYearAndMonth}
            selectedYearAndMonth={selectedYearAndMonth}
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
            transactions={transactions}
          />
        </Card.Root>

        <Heading color="gray.400" margin="8pt 0pt">
          {selectedDate} の記録
        </Heading>

        {isLoadingTransactions ? (
          <Center
            backgroundColor="rgba(160, 174, 192, 0.2)"
            h="25vh"
            borderRadius={30}
          >
            <VStack colorPalette="gray.400">
              <Spinner color="gray.400" />
              <Text color="colorPalette.600">Loading...</Text>
            </VStack>
          </Center>
        ) : (
          <TransactionsList
            categories={categories}
            transactions={transactions}
            selectedDate={selectedDate}
            deleteTransaction={deleteTransaction}
            updateTransaction={updatedTransaction}
          />
        )}

        <IconButton
          position="fixed"
          bottom={10}
          right={0}
          m="4"
          height={81}
          width={81}
          borderRadius={30}
          colorPalette="green"
          variant="solid"
          onClick={() => setIsDialogOpen(true)}
        >
          <AiFillPlusCircle
            style={{
              width: "60%",
              height: "60%",
            }}
          />
        </IconButton>

        {isDialogOpen && (
          <TransactionsForm
            categories={categories}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleTransaction={async (data) => {
              const res = await postWithAuth("/transactions", data);
              addTransaction(res);
            }}
            defaultValues={defaultValues}
            formTitle="お金の新規記録"
            submitButtonText="記録"
            loadingText="記録中..."
          />
        )}
      </Stack>
    </>
  );
}

export default MyRegister;
