import { useState, useEffect } from "react";
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
      return item ? item.total_amount : 0;
    });
    return [category.name, ...amounts];
  });

  return rows;
};

export default function MyTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rows, setRows] = useState<(string | number)[][]>([]);
  // const [loading, setLoading] = useState(true);

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
        setRows(createRows({ categories, amountPerCategoryPerMonth: data }));
      })
      .catch((e) => console.error("Failed to fetch categories", e));
  }, [categories]);

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
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIdx) => (
            <TableRow key={categories[rowIdx]?.id || rowIdx}>
              <TableCell>{categories[rowIdx]?.name}</TableCell>
              {row.slice(1).map((cell, cellIdx) => (
                <TableCell key={cellIdx} align="right">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
