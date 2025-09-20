export type Category = {
  id: string;
  name: string;
  type: string;
  is_deleted: boolean;
  description: string;
};

export type AddCategory = {
  name: string;
  type: string;
  description: string;
};
