export type Category = {
  id: string;
  name: string;
  type: string;
  is_deleted: boolean;
};

export type AddCategory = {
  name: string;
  type: string;
};
