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

export type PutTransaction = {
  date: string;
  amount: number;
  type: string;
  categoryId: string;
  memo: string;
};

export type PostTransaction = {
  date: string;
  amount: number;
  type: string;
  categoryId: string;
  memo: string;
};
