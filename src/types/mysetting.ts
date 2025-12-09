export type CategoryType = {
  id: string;
  name: string;
  type: "income" | "expense";
  is_deleted: boolean;
  description: string;
  registration_date: string | null;
  amount: string | null;
};

export type typeSelect = {
  value: string;
  label: string;
};
