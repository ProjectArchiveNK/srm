import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";
import {
  useAddRowMutation,
  useGetMonthsQuery,
  useUpdateRowMutation,
  useDeleteRowMutation,
} from "../api/coffeeApi";
import { useState } from "react";
import type { Dayjs } from "dayjs";
import type { CoffeeRow } from "../types/coffee";
import type { Comment } from "../types/coffee";
import type { EditingRow } from "../types/coffee";
import type { OperationDraft } from "../types/coffee";
import { initialRow } from "../constants/initialRow";
import { message } from "antd";
import dayjs from "dayjs";

export const useCoffeeRows = () => {
  const [addRowRequest] = useAddRowMutation();
  const { data: months } = useGetMonthsQuery();
  const [updateRowRequest] = useUpdateRowMutation();
  const [deleteRowRequest] = useDeleteRowMutation();
  const selectedMonthId = useSelector(
    (state: RootState) => state.coffee.selectedMonthId,
  );
  const [newRow, setNewRow] = useState<EditingRow>(initialRow);
  const [editingRow, setEditingRow] = useState<CoffeeRow | null>(null);
  const [operationDraft, setOperationDraft] = useState<OperationDraft>({
    type: "paid",
    amount: 0,
    text: "",
    date: dayjs().format("D MMMM"),
  });

  // добавление новой строки в месяц
  const addRow = () => {
    const weeksCount =
      months?.find((month) => month._id === selectedMonthId)?.data.length ?? 0;

    if (weeksCount >= 6) {
      message.warning("В месяце может быть максимум 6 недель");
      return;
    }

    addRowRequest({ selectedMonthId, newRow });
    setNewRow((prev) => ({ ...prev, date: [] }));
  };

  // добавление дней в неделю
  const handleDateChange = (day: Dayjs | null) => {
    if (!day) return;

    const selectedDay = String(day.date());

    setNewRow((prev) => ({
      ...prev,
      date: prev.date.includes(selectedDay)
        ? prev.date
        : [...prev.date, selectedDay].sort(
            (currentDay, nextDay) => Number(currentDay) - Number(nextDay),
          ),
    }));
  };

  // крестик у тегов при выборе дней недели
  const removeDate = (day: string) => {
    setNewRow((prev) => ({
      ...prev,
      date: prev.date.filter((dayRow) => dayRow !== day),
    }));
  };

  // + удаляю дни из недели
  const removeEditDate = async (day: string) => {
    if (!editingRow) return;

    const updatedRow = {
      ...editingRow,
      date: editingRow.date.filter((item) => item !== day),
    };

    setEditingRow(updatedRow);
    await saveEditingRow(updatedRow);
  };

  // + добовляю дни в тестовую неделю
  const addEditDate = async (day: number) => {
    if (!editingRow) return;

    const dayString = String(day);

    if (editingRow.date.includes(dayString)) {
      message.warning("Этот день уже добавлен в неделю");
      return;
    }

    const updatedRow = {
      ...editingRow,
      date: [...editingRow.date, dayString].sort(
        (currentDay, nextDay) => Number(currentDay) - Number(nextDay),
      ),
    };

    setEditingRow(updatedRow);

    await saveEditingRow(updatedRow);
  };

  // + удаление коментария
  const removeComment = async (commentId: string) => {
    if (!editingRow) return;

    const updatedRow = {
      ...editingRow,
      comment: editingRow.comment.filter(
        (comment) => comment._id !== commentId,
      ),
    };

    setEditingRow(updatedRow);

    await saveEditingRow(updatedRow);
  };

  // + Создаёт и добавляет комментарий
  const saveComment = async () => {
    if (!editingRow || !operationDraft.type) return;

    const newComment = {
      _id: crypto.randomUUID(),
      operation: operationDraft.type,
      amount: Number(operationDraft.amount),
      text: operationDraft.text,
      date: operationDraft.date,
    };

    const updatedRow = {
      ...editingRow,
      comment: [...editingRow.comment, newComment],
    };

    setEditingRow(updatedRow);

    await saveEditingRow(updatedRow);

    setOperationDraft({
      type: "paid",
      amount: 0,
      text: "",
      date: dayjs().format("D MMMM"),
    });
  };

  // редактирует коментарий
  const updateComment = async (commentDraft: Comment) => {
    if (!editingRow) return;

    const updatedRow = {
      ...editingRow,
      comment: editingRow.comment.map((com) =>
        com._id === commentDraft._id ? commentDraft : com,
      ),
    };

    setEditingRow(updatedRow);

    await saveEditingRow(updatedRow);
  };

  // + обновляю всю неделю
  const saveEditingRow = async (updatedRow: CoffeeRow) => {
    await updateRowRequest({
      selectedMonthId,
      rowId: updatedRow._id,
      editingRow: updatedRow,
    });
  };

  // поиск недель для удаления
  const getWeeksForDelete = months?.find(
    (week) => week?._id === selectedMonthId,
  );

  // Удаление строки
  const deleteRow = async (rowId: string) => {
    await deleteRowRequest({ selectedMonthId, rowId });
  };

  return {
    addRow,
    newRow,
    handleDateChange,
    removeDate,
    setNewRow,
    editingRow,
    setEditingRow,
    removeEditDate,
    addEditDate,
    saveEditingRow,
    operationDraft,
    setOperationDraft,
    removeComment,
    getWeeksForDelete,
    deleteRow,
    saveComment,
    updateComment,
  };
};
