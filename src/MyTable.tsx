import { useState, useEffect, useMemo } from "react";

import type { Category } from "./components/types/mytable.ts";
import { Table, Card } from "@chakra-ui/react";

type AmountPerCategoryPerMonth = {
  month: string;
  categoryId: string;
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
          entry.month === String(month) && entry.categoryId === category.id
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
    <div>
      <Card.Root m="4" variant="outline">
        <Card.Header>
          <Card.Title>年間収支記録</Card.Title>
        </Card.Header>
        <Card.Body>
          <Table.ScrollArea borderWidth="1px">
            <Table.Root size="sm" variant="outline" textSizeAdjust="auto">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>月</Table.ColumnHeader>
                  {[...Array(12)].map((_, i) => (
                    <Table.ColumnHeader key={i + 1} align="right">
                      {i + 1}月
                    </Table.ColumnHeader>
                  ))}
                  <Table.ColumnHeader>合計</Table.ColumnHeader>
                  <Table.ColumnHeader>平均</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rowsIncome.map((row, rowIdx) => (
                  <Table.Row key={categories[rowIdx]?.id || rowIdx}>
                    <Table.Cell>{row[0]}</Table.Cell>
                    {row.slice(1).map((cell, cellIdx) => (
                      <Table.Cell key={cellIdx} align="right">
                        {typeof cell === "number"
                          ? Math.floor(cell).toLocaleString()
                          : cell}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}

                {incomeTotalsPerMonth.length > 0 && (
                  <Table.Row backgroundColor="#e9f3ffff" fontWeight="bold">
                    <Table.Cell fontWeight="bold">
                      {incomeTotalsPerMonth[0]}
                    </Table.Cell>
                    {incomeTotalsPerMonth.slice(1).map((total, cellIdx) => (
                      <Table.Cell key={cellIdx} align="right" fontWeight="bold">
                        {typeof total === "number"
                          ? Math.floor(total).toLocaleString()
                          : total}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                )}

                {rowsExpense.map((row, rowIdx) => (
                  <Table.Row key={categories[rowIdx]?.id || rowIdx}>
                    <Table.Cell>{row[0]}</Table.Cell>
                    {row.slice(1).map((cell, cellIdx) => (
                      <Table.Cell key={cellIdx} align="right">
                        {typeof cell === "number"
                          ? Math.floor(cell).toLocaleString()
                          : cell}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}

                {expenseTotalsPerMonth.length > 0 && (
                  <Table.Row backgroundColor="#ffe9e9ff" fontWeight="bold">
                    <Table.Cell fontWeight="bold">
                      {expenseTotalsPerMonth[0]}
                    </Table.Cell>
                    {expenseTotalsPerMonth.slice(1).map((total, cellIdx) => (
                      <Table.Cell key={cellIdx} align="right" fontWeight="bold">
                        {typeof total === "number"
                          ? Math.floor(total).toLocaleString()
                          : total}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                )}

                {BOP.length > 0 && (
                  <Table.Row backgroundColor="#f5f5f5" fontWeight="bold">
                    <Table.Cell fontWeight="bold">{BOP[0]}</Table.Cell>
                    {BOP.slice(1).map((total, cellIdx) => (
                      <Table.Cell key={cellIdx} align="right" fontWeight="bold">
                        {typeof total === "number"
                          ? Math.floor(total).toLocaleString()
                          : total}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
