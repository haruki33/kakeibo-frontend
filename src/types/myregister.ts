export type Category = {
  id: string;
  name: string;
  type: string;
  is_deleted: boolean;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: string;
  categoryId: string;
  memo: string;
};
