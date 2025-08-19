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
      <CategoriesList categories={categories} />
      <CategoriesForm addCategories={addCategories} />
    </>
  );
}

export default Setting;
