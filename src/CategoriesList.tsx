import { useEffect, useState } from "react";

import CategoriesEditModal from "./CategoriesEditModal";

type Category = {
  id: string;
  name: string;
  color: string;
  type: string;
};

type categoriesListProps = {
  categories: Category[];
};

export default function CategoriesList({ categories }: categoriesListProps) {
  const [localCategories, setLocalCategories] =
    useState<Category[]>(categories);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const deleteCategory = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");

      setLocalCategories((cats) => cats.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div>
      <h2>カテゴリ一覧</h2>
      <ul>
        {localCategories.map((cat) => (
          <li key={cat.id}>
            {cat.name} ({cat.type})
            <button onClick={() => deleteCategory(cat.id)}>削除</button>
            <button onClick={() => setEditTarget(cat)}>編集</button>
          </li>
        ))}
      </ul>

      {editTarget && (
        <CategoriesEditModal
          id={editTarget.id}
          currentName={editTarget.name}
          currentColor={editTarget.color}
          currentType={editTarget.type}
          onClose={() => setEditTarget(null)}
          onUpdated={() => {
            setEditTarget(null);
            setLocalCategories((cats) =>
              cats.filter((cat) => cat.id !== editTarget.id)
            );
          }}
        />
      )}
    </div>
  );
}
