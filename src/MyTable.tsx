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
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const columns = categories.map((category) => category.id);

  const cells = rows.map((month) => {
    return columns.map((categoryId) => {
      const items = amountPerCategoryPerMonth.find(
        (item) => (
          console.log(item.month, month, item.category_id, categoryId),
          item.month === String(month) && item.category_id === categoryId
        )
      );
      return items ? items.total_amount : 0;
    });
  });
  return cells;
};

export default function MyTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rows, setRows] = useState<number[][]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories for the dropdown
    fetch("http://localhost:3000/categories")
      .then((res) => res.json())
      .then((data: Category[]) => {
        setCategories(data);
      })
      .catch((e) => console.error("Failed to fetch categories", e));
  }, []);

  useEffect(() => {
    // Fetch categories for the dropdown
    fetch(
      `http://localhost:3000/transactions/summary?year=${new Date().getFullYear()}`
    )
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
            <TableCell>カテゴリー </TableCell>
            {categories.map((category) => (
              <TableCell key={category.id} align="right">
                {category.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, monthIdx) => (
            <TableRow key={monthIdx}>
              <TableCell>{monthIdx + 1}月</TableCell>
              {row.map((cell, cellIdx) => (
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
