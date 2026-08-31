// создание месяца
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateMonthMutation,
  useGetMonthsQuery,
  useDeleteMonthMutation,
  useUpdateMonthMutation,
} from "../api/coffeeApi";
import type { RootState } from "../../../app/store/store";
import { useEffect, useMemo, useState } from "react";
import { setSelectedMonthId } from "../../../app/store/slices/coffeeSlice";
import { message } from "antd";

export const useCoffeeMonth = () => {
  const { data: months, refetch } = useGetMonthsQuery();
  const [createMonthRequest] = useCreateMonthMutation();
  const [deleteMonthRequest] = useDeleteMonthMutation();
  const [updateMonthRequest] = useUpdateMonthMutation();
  const selectedMonthId = useSelector(
    (state: RootState) => state.coffee.selectedMonthId,
  );
  const [monthSearch, setMonthSearch] = useState("");
  const [monthName, setMonthName] = useState("");
  const [newMonthName, setNewMonthName] = useState("");

  const dispatch = useDispatch();

  // создать пустой месяц
  const createMonth = async (monthName: string) => {
    const exists = months?.some(
      (item) =>
        item.month.trim().toLowerCase() === monthName.trim().toLowerCase(),
    );

    if (exists) {
      message.warning("Месяц с таким названием уже существует");
      return;
    }

    setMonthName("");

    const newMonth = await createMonthRequest({
      month: monthName,
      data: [],
    }).unwrap();

    dispatch(setSelectedMonthId(newMonth._id));
  };

  // редактирую имя месяца
  const updateMonth = async (monthId: string, newNameMonth: string) => {
    const exists = months?.some(
      (item) =>
        item.month.trim().toLowerCase() === newMonthName.trim().toLowerCase(),
    );

    if (currentMonth?.month.trim() === newNameMonth.trim()) {
      message.info("Имя месяца не изменилось!");
      return;
    }

    if (exists) {
      message.warning("Месяц с таким названием уже существует!");
      return;
    }

    if (!selectedMonthId) {
      message.warning("Месяц не выбран!");
      return;
    }

    await updateMonthRequest({ monthId, newNameMonth }).unwrap();
  };

  // опции для выбора месяца (селекта)
  const monthOptions =
    months
      ?.slice()
      .reverse()
      .map((month) => ({
        value: month._id,
        label: month.month,
      })) ?? [];

  // авто-выбор первого месяца для селекта
  useEffect(() => {
    if (!selectedMonthId && months?.length) {
      dispatch(setSelectedMonthId(months[months.length - 1]._id));
    }
  }, [months, selectedMonthId, dispatch]);

  // поиск месяца для удаления
  const filteredMonths = useMemo(() => {
    if (!monthSearch.trim()) return [];

    return (
      months?.filter((item) =>
        item.month.toLowerCase().includes(monthSearch.toLowerCase()),
      ) ?? []
    );
  }, [months, monthSearch]);

  // удалние месяца
  const deleteMonth = async (monthId: string) => {
    await deleteMonthRequest(monthId).unwrap();

    if (selectedMonthId === monthId) {
      const { data: updatedMonths } = await refetch();
      dispatch(
        setSelectedMonthId(
          updatedMonths?.[updatedMonths.length - 1]?._id ?? null,
        ),
      );
    }

    setMonthSearch("");
  };

  // ищу выбраный месяц по селекту
  const currentMonth = months?.find((month) => month._id === selectedMonthId);

  // итоги выброного месяца
  const totalsMonth = (currentMonth?.data ?? []).reduce(
    (sum, row) => ({
      days: sum.days + row.date.length,
      salary: sum.salary + row.salary,
      expenses: sum.expenses + row.expenses,
      cashCollection: sum.cashCollection + row.cashCollection,
      paid: sum.paid + row.paid,
      comments: sum.comments + row.comment.length,
    }),
    {
      days: 0,
      salary: 0,
      expenses: 0,
      cashCollection: 0,
      paid: 0,
      comments: 0,
    },
  );

  const handleMonthChange = (monthId: string) => {
    dispatch(setSelectedMonthId(monthId));

    const month = months?.find((month) => month._id === monthId);

    setNewMonthName(month?.month ?? "");
  };

  return {
    createMonth,
    months,
    monthOptions,
    selectedMonthId,
    currentMonth,
    setMonthSearch,
    monthSearch,
    filteredMonths,
    deleteMonth,
    totalsMonth,
    updateMonth,
    monthName,
    setMonthName,
    newMonthName,
    setNewMonthName,
    handleMonthChange,
  };
};
