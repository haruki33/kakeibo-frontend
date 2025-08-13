import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  type: string;
};

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to fetch categories", e);
        setLoading(false);
      });
  }, []);

  const deleteCategory = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      const res = await fetch(`http://localhost:3000/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");

      setCategories((cats) => cats.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>カテゴリ一覧</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            {cat.name} ({cat.type})
            <button onClick={() => deleteCategory(cat.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
