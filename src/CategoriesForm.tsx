import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Category = {
  id: string;
  name: string;
  color: string;
  type: string;
};

type CategoriesFormProps = {
  categories: Category[];
  addCategories: (category: Category) => void;
};

export default function CategoriesForm({
  categories,
  addCategories,
}: CategoriesFormProps) {
  const [name, setName] = useState<string>("給料");
  const [color, setColor] = useState<string>("#ff7f50");
  const [type, setType] = useState<string>("income");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (categories.some((cat) => cat.name === name)) {
      alert("同じ名前のカテゴリが存在します");
      setLoading(false);
      return;
    }

    const newCategory: Category = {
      id: uuidv4(),
      name,
      color,
      type,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
      if (!res.ok) {
        throw new Error("Failed to create category");
      }

      addCategories(newCategory);
      setName("給料");
      setColor("#ff7f50");
      setType("income");
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>カテゴリ登録</h2>
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
        <button type="submit">登録</button>
      </form>
    </div>
  );
}
