import { useState, useEffect, useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

type Category = {
  id: string;
  name: string;
  color: string;
  type: string;
};

type AmountPerCategoryPerMonth = {
  month: string;
  category_id: string;
  total_amount: number;
};

const createRows = ({
  categories,
  amountPerCategoryPerMonth,
}: {
  categories: Category[];
  amountPerCategoryPerMonth: AmountPerCategoryPerMonth[];
}) => {
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Each row is [categoryName, ...amounts for each month]
  const rows = categories.map((category) => {
    const amounts = columns.map((month) => {
      const item = amountPerCategoryPerMonth.find(
        (entry) =>
          entry.month === String(month) && entry.category_id === category.id
      );
      return item ? Number(item.total_amount) : 0;
    });
    const sum = amounts.reduce((acc, curr) => acc + curr, 0);
    const ave = sum / columns.length;
    return [category.name, ...amounts, sum, ave];
  });

  return rows;
};

const calculateColumnTotals = (rows: (string | number)[][]) => {
  if (rows.length === 0) return [];

  // 最初の列（カテゴリ名）を除いて、数値列のみを対象とする
  const numericColumns = rows[0].length - 1; // カテゴリ名を除く列数
  const totals = Array(numericColumns).fill(0);

  rows.forEach((row) => {
    for (let i = 1; i < row.length; i++) {
      // i=1から開始（カテゴリ名をスキップ）
      const value = row[i];
      if (typeof value === "number") {
        totals[i - 1] += value; // インデックス調整
      }
    }
  });

  return ["合計", ...totals];
};

const calculateBOP = (rowsIncome: number[], rowsExpense: number[]) => {
  if (rowsIncome.length === 0 && rowsExpense.length === 0) return [];
  const totals = Array(rowsIncome.length - 1).fill(0);

  for (let i = 0; i < totals.length; i++) {
    // i=1から開始（カテゴリ名をスキップ）
    const valueIncome = rowsIncome[i + 1];
    const valueExpense = rowsExpense[i + 1];
    if (typeof valueIncome === "number" && typeof valueExpense === "number") {
      const bop = valueIncome - valueExpense;
      totals[i] = bop >= 0 ? bop : `🔺${bop}`;
    }
  }
  return ["収支", ...totals];
};

export default function MyTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rowsIncome, setRowsIncome] = useState<(string | number)[][]>([]);
  const [rowsExpense, setRowsExpense] = useState<(string | number)[][]>([]);

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
    fetch(`${baseUrl}/transactions/summary?year=${new Date().getFullYear()}`)
      .then((res) => res.json())
      .then((data: AmountPerCategoryPerMonth[]) => {
        setRowsIncome(
          createRows({
            categories: categories.filter((cat) => cat.type === "income"),
            amountPerCategoryPerMonth: data,
          })
        );
        setRowsExpense(
          createRows({
            categories: categories.filter((cat) => cat.type === "expense"),
            amountPerCategoryPerMonth: data,
          })
        );
      })
      .catch((e) => console.error("Failed to fetch categories", e));
  }, [categories]);

  const incomeTotalsPerMonth = useMemo(
    () => calculateColumnTotals(rowsIncome),
    [rowsIncome]
  );
  const expenseTotalsPerMonth = useMemo(
    () => calculateColumnTotals(rowsExpense),
    [rowsExpense]
  );
  const BOP = useMemo(
    () => calculateBOP(incomeTotalsPerMonth, expenseTotalsPerMonth),
    [incomeTotalsPerMonth, expenseTotalsPerMonth]
  );

  return (
    <TableContainer component={Container}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>月</TableCell>
            {[...Array(12)].map((_, i) => (
              <TableCell key={i + 1} align="right">
                {i + 1}月
              </TableCell>
            ))}
            <TableCell>合計</TableCell>
            <TableCell>平均</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsIncome.map((row, rowIdx) => (
            <TableRow key={categories[rowIdx]?.id || rowIdx}>
              <TableCell>{row[0]}</TableCell>
              {row.slice(1).map((cell, cellIdx) => (
                <TableCell key={cellIdx} align="right">
                  {typeof cell === "number" ? cell.toLocaleString() : cell}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {incomeTotalsPerMonth.length > 0 && (
            <TableRow sx={{ backgroundColor: "#e9f3ffff", fontWeight: "bold" }}>
              <TableCell sx={{ fontWeight: "bold" }}>
                {incomeTotalsPerMonth[0]}
              </TableCell>
              {incomeTotalsPerMonth.slice(1).map((total, cellIdx) => (
                <TableCell
                  key={cellIdx}
                  align="right"
                  sx={{ fontWeight: "bold" }}
                >
                  {typeof total === "number" ? total.toLocaleString() : total}
                </TableCell>
              ))}
            </TableRow>
          )}

          {rowsExpense.map((row, rowIdx) => (
            <TableRow key={categories[rowIdx]?.id || rowIdx}>
              <TableCell>{row[0]}</TableCell>
              {row.slice(1).map((cell, cellIdx) => (
                <TableCell key={cellIdx} align="right">
                  {typeof cell === "number" ? cell.toLocaleString() : cell}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {expenseTotalsPerMonth.length > 0 && (
            <TableRow sx={{ backgroundColor: "#ffe9e9ff", fontWeight: "bold" }}>
              <TableCell sx={{ fontWeight: "bold" }}>
                {expenseTotalsPerMonth[0]}
              </TableCell>
              {expenseTotalsPerMonth.slice(1).map((total, cellIdx) => (
                <TableCell
                  key={cellIdx}
                  align="right"
                  sx={{ fontWeight: "bold" }}
                >
                  {typeof total === "number" ? total.toLocaleString() : total}
                </TableCell>
              ))}
            </TableRow>
          )}

          {BOP.length > 0 && (
            <TableRow sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
              <TableCell sx={{ fontWeight: "bold" }}>{BOP[0]}</TableCell>
              {BOP.slice(1).map((total, cellIdx) => (
                <TableCell
                  key={cellIdx}
                  align="right"
                  sx={{ fontWeight: "bold" }}
                >
                  {typeof total === "number" ? total.toLocaleString() : total}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
