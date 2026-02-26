import { useState, useEffect, useMemo } from "react";
import type { Category } from "../../types/mytable.ts";
import {
  Table,
  Card,
  Flex,
  Switch,
  Center,
  VStack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import MyPopover from "./MyPopover.tsx";
import { useAuth } from "../../utils/useAuth.tsx";
import { fetchWithAuth } from "../../utils/fetchWithAuth.tsx";

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
          entry.month === String(month) && entry.categoryId === category.id,
      );
      return item ? Number(item.total_amount) : 0;
    });
    const sum = amounts.reduce((acc, curr) => acc + curr, 0);
    const ave = sum / columns.length;
    return [category.id, category.name, ...amounts, sum, ave];
  });

  return rows;
};

const calculateColumnTotals = (rows: (string | number)[][]) => {
  if (rows.length === 0) return [];

  // 最初の列（カテゴリ名）を除いて、数値列のみを対象とする
  const numericColumns = rows[0].length - 1;
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

export default function MyTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [amountPerCategoryPerMonth, setAmountPerCategoryPerMonth] = useState<
    AmountPerCategoryPerMonth[]
  >([]);
  const [rowsIncome, setRowsIncome] = useState<(string | number)[][]>([]);
  const [rowsExpense, setRowsExpense] = useState<(string | number)[][]>([]);
  const [checked, setChecked] = useState<boolean>(false);

  const [clickedCategoryId, setClickedCategoryId] = useState<string>("");
  const [clickedMonthIdx, setClickedMonthIdx] = useState<number>(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const { onLogout } = useAuth();

  const [isUpdatingTransactionInTable, setIsUpdatingTransactionInTable] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  /// 変更されたときに再レンダリング
  useEffect(() => {
    const loadTransactionsSummary = async () => {
      try {
        const data = await fetchWithAuth(
          `/transactions/summary?year=${new Date().getFullYear()}`,
        );
        setAmountPerCategoryPerMonth(data);
      } catch (err) {
        console.error(err);
        onLogout();
      } finally {
        setIsUpdatingTransactionInTable(false);
        setIsPopoverOpen(false);
      }
    };

    if (
      isUpdatingTransactionInTable ||
      amountPerCategoryPerMonth.length === 0
    ) {
      loadTransactionsSummary();
    }
  }, [onLogout, isUpdatingTransactionInTable, amountPerCategoryPerMonth]);

  useEffect(() => {
    const filteredCategories = checked
      ? categories
      : categories.filter((cat) => !cat.is_deleted);
    setRowsIncome(
      createRows({
        categories: filteredCategories.filter((cat) => cat.type === "income"),
        amountPerCategoryPerMonth: amountPerCategoryPerMonth,
      }),
    );
    setRowsExpense(
      createRows({
        categories: filteredCategories.filter((cat) => cat.type === "expense"),
        amountPerCategoryPerMonth: amountPerCategoryPerMonth,
      }),
    );
  }, [categories, amountPerCategoryPerMonth, checked]);

  const incomeTotalsPerMonth = useMemo(
    () => calculateColumnTotals(rowsIncome),
    [rowsIncome],
  );
  const expenseTotalsPerMonth = useMemo(
    () => calculateColumnTotals(rowsExpense),
    [rowsExpense],
  );

  const calculateBOP = (rowsIncome: number[], rowsExpense: number[]) => {
    setIsLoading(true);
    if (rowsIncome.length === 0 && rowsExpense.length === 0) return [];
    const totals = Array(rowsIncome.length - 1).fill(0);

    for (let i = 0; i < totals.length; i++) {
      const valueIncome = rowsIncome[i + 1];
      const valueExpense = rowsExpense[i + 1];
      if (typeof valueIncome === "number" && typeof valueExpense === "number") {
        const bop = valueIncome - valueExpense;
        totals[i] = bop >= 0 ? bop : `🔺${bop}`;
      }
    }
    setIsLoading(false);
    return ["収支", ...totals];
  };

  const BOP = useMemo(
    () => calculateBOP(incomeTotalsPerMonth, expenseTotalsPerMonth),
    [incomeTotalsPerMonth, expenseTotalsPerMonth],
  );

  const handleClickCell = async (
    clickedCategoryId: string,
    clickedMonthIdx: number,
  ) => {
    setClickedCategoryId(clickedCategoryId);
    setClickedMonthIdx(clickedMonthIdx);
    setIsPopoverOpen(true);
  };

  return (
    <>
      <Card.Root
        m="4"
        variant="outline"
        borderRadius={30}
        h="calc(100vh - 64px - 5vh - 2rem)"
      >
        <Card.Header>
          <Flex justify="space-between" align="center">
            <Card.Title textStyle={{ base: "lg", md: "xl" }}>
              年間収支記録
            </Card.Title>
            <Switch.Root
              checked={checked}
              onCheckedChange={(e) => setChecked(e.checked)}
            >
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label textStyle={{ base: "xs", md: "sm" }}>
                削除済みも表示
              </Switch.Label>
            </Switch.Root>
          </Flex>
        </Card.Header>
        <Card.Body h="calc(100vh - 64px - 5vh - 2rem - 80px)">
          {isLoading ? (
            <Center h="100%">
              <VStack colorPalette="gray.400">
                <Spinner color="gray.400" />
                <Text color="colorPalette.600">Loading...</Text>
              </VStack>
            </Center>
          ) : (
            <Table.ScrollArea h="100%" borderWidth="1px">
              <Table.Root
                size="sm"
                variant="line"
                stickyHeader
                css={{
                  "& [data-sticky]": {
                    position: "sticky",
                    _after: {
                      content: '""',
                      position: "absolute",
                      pointerEvents: "none",
                      top: "0",
                      bottom: "-1px",
                      width: "10px",
                    },
                  },

                  "& [data-sticky=categoriesEnd]": {
                    bg: "white",
                    _after: {
                      insetInlineEnd: "0",
                      translate: "100% 0",
                      shadow: "inset 8px 0px 8px -8px rgba(0, 0, 0, 0.16)",
                    },
                  },

                  "& [data-sticky=incomeEnd]": {
                    bg: "#e9f3ff",
                    _after: {
                      insetInlineEnd: "0",
                      translate: "100% 0",
                      shadow: "inset 8px 0px 8px -8px rgba(0, 0, 0, 0.16)",
                    },
                  },

                  "& [data-sticky=expenseEnd]": {
                    bg: "#ffe9e9",
                    _after: {
                      insetInlineEnd: "0",
                      translate: "100% 0",
                      shadow: "inset 8px 0px 8px -8px rgba(0, 0, 0, 0.16)",
                    },
                  },

                  "& [data-sticky=sumEnd]": {
                    bg: "#f5f5f5",
                    _after: {
                      insetInlineEnd: "0",
                      translate: "100% 0",
                      shadow: "inset 8px 0px 8px -8px rgba(0, 0, 0, 0.16)",
                    },
                  },
                }}
              >
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader data-sticky="categoriesEnd" left="0">
                      月
                    </Table.ColumnHeader>
                    {[...Array(12)].map((_, i) => (
                      <Table.ColumnHeader key={i + 1} textAlign="center">
                        {i + 1}月
                      </Table.ColumnHeader>
                    ))}
                    <Table.ColumnHeader textAlign="center">
                      合計
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      平均
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {rowsIncome.map((row, rowIdx) => (
                    <Table.Row key={rowIdx}>
                      <Table.Cell
                        data-sticky="categoriesEnd"
                        left="0"
                        maxW="7rem"
                      >
                        <Text truncate>{row[1]}</Text>
                      </Table.Cell>
                      {row.slice(2).map((cell, cellIdx) => (
                        <Table.Cell
                          key={cellIdx}
                          textAlign="right"
                          onClick={() => {
                            handleClickCell(String(row[0]), cellIdx);
                          }}
                        >
                          {typeof cell === "number"
                            ? Math.floor(cell).toLocaleString()
                            : cell}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))}

                  {incomeTotalsPerMonth.length > 0 && (
                    <Table.Row backgroundColor="#e9f3ff" fontWeight="bold">
                      <Table.Cell
                        fontWeight="bold"
                        data-sticky="incomeEnd"
                        maxW="7rem"
                        left="0"
                      >
                        {incomeTotalsPerMonth[0]}
                      </Table.Cell>
                      {incomeTotalsPerMonth.slice(2).map((total, cellIdx) => (
                        <Table.Cell
                          key={cellIdx}
                          textAlign="right"
                          fontWeight="bold"
                        >
                          {typeof total === "number"
                            ? Math.floor(total).toLocaleString()
                            : total}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  )}

                  {rowsExpense.map((row, rowIdx) => (
                    <Table.Row key={rowIdx}>
                      <Table.Cell
                        data-sticky="categoriesEnd"
                        left="0"
                        maxW="7rem"
                      >
                        <Text truncate>{row[1]}</Text>
                      </Table.Cell>
                      {row.slice(2).map((cell, cellIdx) => (
                        <Table.Cell
                          key={cellIdx}
                          textAlign="right"
                          onClick={() => {
                            handleClickCell(String(row[0]), cellIdx);
                          }}
                        >
                          {typeof cell === "number"
                            ? Math.floor(cell).toLocaleString()
                            : cell}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))}

                  {expenseTotalsPerMonth.length > 0 && (
                    <Table.Row
                      backgroundColor="#ffe9e9"
                      fontWeight="bold"
                      maxW="7rem"
                    >
                      <Table.Cell
                        fontWeight="bold"
                        data-sticky="expenseEnd"
                        left="0"
                      >
                        {expenseTotalsPerMonth[0]}
                      </Table.Cell>
                      {expenseTotalsPerMonth.slice(2).map((total, cellIdx) => (
                        <Table.Cell
                          key={cellIdx}
                          textAlign="right"
                          fontWeight="bold"
                        >
                          {typeof total === "number"
                            ? Math.floor(total).toLocaleString()
                            : total}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  )}

                  {BOP.length > 0 && (
                    <Table.Row
                      backgroundColor="#f5f5f5"
                      fontWeight="bold"
                      maxW="7rem"
                    >
                      <Table.Cell
                        fontWeight="bold"
                        data-sticky="sumEnd"
                        left="0"
                      >
                        {BOP[0]}
                      </Table.Cell>
                      {BOP.slice(2).map((total, cellIdx) => (
                        <Table.Cell
                          key={cellIdx}
                          textAlign="right"
                          fontWeight="bold"
                        >
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
          )}
        </Card.Body>
      </Card.Root>

      {isPopoverOpen && (
        <MyPopover
          isPopoverOpen={isPopoverOpen}
          setIsPopoverOpen={setIsPopoverOpen}
          categories={categories}
          clickedCategoryId={clickedCategoryId}
          clickedMonthIdx={clickedMonthIdx}
          setIsUpdatingTransactionInTable={setIsUpdatingTransactionInTable}
        />
      )}
    </>
  );
}
