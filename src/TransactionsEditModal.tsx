import React, { useState, useEffect } from "react";

type Category = {
  id: string;
  name: string;
};

type TransactionsEditModalProps = {
  id: string;
  currentDate: string;
  currentAmount: number;
  currentType: string;
  currentCategoryId: string;
  currentMemo: string;
  onClose: () => void;
  onUpdated: () => void;
};

const TransactionsEditModal = ({
  id,
  currentDate,
  currentAmount,
  currentType,
  currentCategoryId,
  currentMemo,
  onClose,
  onUpdated,
}: TransactionsEditModalProps) => {
  const [date, setDate] = useState(currentDate);
  const [amount, setAmount] = useState(currentAmount);
  const [type, setType] = useState(currentType);
  const [categoryId, setCategoryId] = useState(currentCategoryId);
  const [memo, setMemo] = useState(currentMemo);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    fetch(`${baseUrl}/categories`)
      .then((res) => res.json())
      .then((data: Category[]) => {
        setCategories(data);
      })
      .catch((e) => console.error("Failed to fetch categories", e));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, amount, type, categoryId, memo }),
      });
      if (!res.ok) throw new Error("更新失敗");

      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("取引更新に失敗しました");
    }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <h3>取引編集</h3>
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
          <div style={{ marginTop: "1rem" }}>
            <button type="submit">更新</button>
            <button type="button" onClick={onClose}>
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 簡易スタイル
const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContent: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "1rem",
  borderRadius: "4px",
  minWidth: "300px",
};

export default TransactionsEditModal;
