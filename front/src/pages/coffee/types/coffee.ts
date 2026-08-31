export type Operation = "expenses" | "paid" | "cashCollection" | "other";

export type Comment = {
  _id: string;
  operation: Operation;
  amount: number;
  text: string;
  date: string | null;
};

export type CoffeeRow = {
  _id: string;
  date: string[];
  salary: number;
  expenses: number;
  cashCollection: number;
  paid: number;
  comment: Comment[];
};

export type Month = {
  _id: string;
  month: string;
  data: CoffeeRow[];
};

export type EditingRow = {
  date: string[];
  salary: number;
  expenses: number;
  cashCollection: number;
  paid: number;
  comment: Comment[];
};

export type OperationDraft = {
  type: Operation;
  amount: number;
  text: string;
  date: string | null;
};
