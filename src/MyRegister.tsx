import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Calendar from "./Calendar.tsx";
import TransactionsList from "./TransactionsList.tsx";
import TransactionsForm from "./TransactionsForm.tsx";

type Category = {
  id: string;
  name: string;
  type: string;
  color: string;
};

type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: string;
  category_id: string;
  memo: string;
};

function MyRegister() {
  const [selectedYearAndMonth, setSelectedYearAndMonth] = useState(
    `${new Date().toISOString().slice(0, 7)}`
  );
  const [selectedDate, setSelectedDate] = useState(
    `${new Date().toISOString().slice(0, 10)}`
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

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
        console.log("fetched transactions:", data);
        setTransactions(data);
        setIsUpdated(false);
        // setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to fetch transactions", e);
        // setLoading(false);
      });
  }, [selectedYearAndMonth, isUpdated]);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Calendar
              setYearAndMonth={setSelectedYearAndMonth}
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
              transactions={transactions}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }} sx={{ height: "50dvh" }}>
                <TransactionsList
                  transactions={transactions}
                  selectedDate={selectedDate}
                  deleteTransaction={deleteTransaction}
                  updateTransaction={updatedTransaction}
                />
              </Grid>
              <Grid size={{ xs: 12 }} sx={{ height: "50dvh" }}>
                <TransactionsForm
                  categories={categories}
                  addTransaction={addTransaction}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default MyRegister;
