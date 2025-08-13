import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Calendar from "./Calendar.tsx";
import TransactionsList from "./TransactionsList.tsx";
import TransactionsForm from "./TransactionsForm.tsx";

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  useEffect(() => {
    fetch(`http://localhost:3000/transactions?month=${selectedYearAndMonth}`)
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
          <Grid size={{ xs: 12, md: 8 }}>
            <Calendar
              setYearAndMonth={setSelectedYearAndMonth}
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
              transactions={transactions}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TransactionsList
              transactions={transactions}
              setYearAndMonth={setSelectedYearAndMonth}
              setTransactions={setTransactions}
              selectedDate={selectedDate}
              setIsUpdated={setIsUpdated}
            />
            <TransactionsForm />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default MyRegister;
