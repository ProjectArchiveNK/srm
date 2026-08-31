import type { Comment } from "../types/coffee";

export const formatComment = (comment: Comment) => {
  const operationNames = {
    expenses: "Траты",
    paid: "Заплатили",
    cashCollection: "Инкас",
    other: "Другое",
  };

  return {
    amount:
      comment.amount === 0
        ? ""
        : `${comment.amount.toLocaleString("ru-RU")} ₽ -`,
    operation: operationNames[comment.operation] ?? comment.operation,
    date: comment.date ?? "",
    text: comment.text,
  };
};
