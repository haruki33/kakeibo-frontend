import React, { useState } from "react";

type Category = {
  id: string;
  name: string;
  color: string;
  type: string;
};

type CategoryProps = {
  localCategories: Category[];
  id: string;
  currentName: string;
  currentColor: string;
  currentType: string;
  onClose: () => void;
  onUpdated: (updatedCategory: Category) => void;
};

const CategoriesEditModal = ({
  localCategories,
  id,
  currentName,
  currentColor,
  currentType,
  onClose,
  onUpdated,
}: CategoryProps) => {
  const [name, setName] = useState(currentName);
  const [color, setColor] = useState(currentColor);
  const [type, setType] = useState(currentType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (localCategories.some((cat) => cat.name === name)) {
      alert("同じ名前のカテゴリが存在します");
      // setLoading(false);
      return;
    }
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color, type }),
      });
      if (!res.ok) throw new Error("更新失敗");

      const updatedCategory = { id, name, color, type };
      onUpdated(updatedCategory);
      onClose();
    } catch (err) {
      console.error(err);
      alert("取引更新に失敗しました");
    }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <h3>カテゴリー編集</h3>
        <form onSubmit={handleSubmit}>
          <label>
            名前:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            色:
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
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

export default CategoriesEditModal;

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
