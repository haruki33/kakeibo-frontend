import { useEffect, useState } from "react";
import TransactionsEditModal from "./TransactionsEditModal";

type TransactionsListProps = {
  transactions: Transaction[];
  setYearAndMonth: (month: string) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setIsUpdated: (isUpdated: boolean) => void;
  selectedDate: string;
};

type Category = {
  id: string;
  name: string;
};

type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: string;
  category_id: string;
  memo: string;
};

export default function TransactionsList({
  transactions,
  setYearAndMonth,
  setTransactions,
  setIsUpdated,
  selectedDate,
}: TransactionsListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  // const [loading, setLoading] = useState(true);

  console.log(`transactionsListでのselectedDate ${selectedDate}`);

  useEffect(() => {
    // Fetch categories for the dropdown
    fetch("http://localhost:3000/categories")
      .then((res) => res.json())
      .then((data: Category[]) => {
        setCategories(data);
      })
      .catch((e) => console.error("Failed to fetch categories", e));
  }, []);

  const deleteTransaction = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      const res = await fetch(`http://localhost:3000/transactions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete transaction");

      setTransactions(transactions.filter((tx) => tx.id !== id));
      setIsUpdated(true);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // if (loading)
  //   return (
  //     <>
  //       <h2>取引一覧</h2>
  //       <p>Loading...</p>
  //     </>
  //   );

  return (
    <div>
      <h2>取引一覧</h2>
      <ul>
        {transactions.filter((tx) => tx.date.slice(0, 10) === selectedDate)
          .length === 0 ? (
          <li>取引はありません</li>
        ) : (
          transactions
            .filter((tx) => tx.date.slice(0, 10) === selectedDate)
            .map((tx) => (
              <li key={tx.id}>
                日付：{tx.date}, カテゴリ：
                {categories.find((c) => c.id === tx.category_id)?.name} - 価格：
                {tx.amount}円 - メモ：{tx.memo}
                <button onClick={() => deleteTransaction(tx.id)}>削除</button>
                <button onClick={() => setEditTarget(tx)}>編集</button>
              </li>
            ))
        )}

        {editTarget && (
          <TransactionsEditModal
            id={editTarget.id}
            currentDate={editTarget.date.slice(0, 10)}
            currentAmount={editTarget.amount}
            currentType={editTarget.type}
            currentCategoryId={editTarget.category_id}
            currentMemo={editTarget.memo}
            onClose={() => setEditTarget(null)}
            onUpdated={() => {
              setEditTarget(null);
              setIsUpdated(true);
              setYearAndMonth(selectedDate.slice(0, 7));
            }}
          />
        )}
      </ul>
    </div>
  );
}
