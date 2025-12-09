import type { CategoryType } from "@/types/mysetting";

export const sortCategories = (categories: CategoryType[]) => {
  return categories.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "income" ? -1 : 1;
    }
    return a.name.localeCompare(b.name, "ja");
  });
};
