import { useState, useEffect } from "react";
import CategoriesForm from "./CategoriesForm";
import CategoriesList from "./CategoriesList";

type Category = {
  id: string;
  name: string;
  color: string;
  type: string;
};

function Setting() {
  const [categories, setCategories] = useState<Category[]>([]);

  const addCategories = (newCategories: Category) => {
    setCategories((prev: Category[]) => [...prev, newCategories]);
  };

  const deleteCategories = (categoryId: string) => {
    setCategories((prev: Category[]) =>
      prev.filter((cat) => cat.id !== categoryId)
    );
  };

  const updatedCategory = (updatedCategory: Category) => {
    setCategories((prev: Category[]) =>
      prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
  };

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    fetch(`${baseUrl}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        // setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to fetch categories", e);
        // setLoading(false);
      });
  }, []);

  return (
    <>
      <CategoriesList
        categories={categories}
        deleteCategories={deleteCategories}
        updateCategories={updatedCategory}
      />
      <CategoriesForm categories={categories} addCategories={addCategories} />
    </>
  );
}

export default Setting;
