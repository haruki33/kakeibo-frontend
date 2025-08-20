import React, { useState } from "react";

type Category = {
  id: string;
  name: string;
  type: string;
  color: string;
};

type TransactionsFormProps = {
  addTransaction: (newTransaction: Transaction) => void;
  categories: Category[];
};

type TransactionForm = {
  date: string;
  amount: number;
  type: string;
  categoryId: string;
  memo: string;
};

type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: string;
  category_id: string;
  memo: string;
};

export default function TransactionsForm({
  addTransaction,
  categories,
}: TransactionsFormProps) {
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<string>("expense");
  const [categoryId, setCategoryId] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const newTransaction: TransactionForm = {
      date,
      amount,
      type,
      categoryId,
      memo,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Response status:", res.status);
        console.error("Response body:", errorText);
        throw new Error(
          `Failed to create transaction: ${res.status} - ${errorText}`
        );
      }

      const createdTransaction = await res.json();
      addTransaction(createdTransaction);

      // Reset form fields
      setDate(new Date().toISOString().slice(0, 10));
      setAmount(0);
      setType("expense");
      setMemo("");
    } catch (error) {
      console.error("Error creating transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>取引登録</h2>
      <form onSubmit={handleSubmit}>
        <label>
          日付:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label>
          金額:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
        </label>
        <label>
          種類:
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="income">収入</option>
            <option value="expense">支出</option>
          </select>
        </label>
        <label>
          カテゴリ:
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(String(e.target.value))}
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          メモ:
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </label>
        <button type="submit">登録</button>
      </form>
    </div>
  );
}
