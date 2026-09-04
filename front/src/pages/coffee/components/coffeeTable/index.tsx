import { Spin, Table } from "antd";
import { useCoffeeMonth } from "../../hooks/useCoffeeMonths";
import { useCoffeeRows } from "../../hooks/useCoffeeRows";
import EditableNumber from "./EditableNumber";
import EditableDates from "./EditableDates";
import EditableComment from "./EditableComment";
import type { ColumnsType } from "antd/es/table";
import type { CoffeeRow } from "../../types/coffee";

const CoffeeTable = () => {
  const { months, currentMonth } = useCoffeeMonth();

  const {
    editingRow,
    setEditingRow,
    removeEditDate,
    saveEditingRow,
    addEditDate,
    operationDraft,
    setOperationDraft,
    removeComment,
    saveComment,
    updateComment,
  } = useCoffeeRows();

  const columns: ColumnsType<CoffeeRow> = [
    {
      title: "Число",
      dataIndex: "date",
      width: 250,
      render: (dates, record) => (
        <EditableDates
          dates={dates}
          record={record}
          editingRow={editingRow}
          setEditingRow={setEditingRow}
          addEditDate={addEditDate}
          removeEditDate={removeEditDate}
        />
      ),
    },
    {
      title: "Зп",
      dataIndex: "salary",
      onCell: () => ({
        style: {
          padding: "16px 0px",
        },
      }),
      onHeaderCell: () => ({
        style: {
          padding: "16px 0px",
        },
      }),
      render: (_, record) => (
        <EditableNumber
          record={record}
          field="salary"
          editingRow={editingRow}
          setEditingRow={setEditingRow}
          saveEditingRow={saveEditingRow}
        />
      ),
    },
    {
      title: "Траты",
      dataIndex: "expenses",
      onCell: () => ({
        style: {
          padding: "16px 0px",
        },
      }),
      onHeaderCell: () => ({
        style: {
          padding: "16px 0px",
        },
      }),
      render: (_, record) => (
        <EditableNumber
          record={record}
          field="expenses"
          editingRow={editingRow}
          setEditingRow={setEditingRow}
          saveEditingRow={saveEditingRow}
        />
      ),
    },
    {
      title: "Инкас",
      dataIndex: "cashCollection",
      onCell: () => ({
        style: {
          padding: "16px 0px",
        },
      }),
      onHeaderCell: () => ({
        style: {
          padding: "16px 0px",
        },
      }),
      render: (_, record) => (
        <EditableNumber
          record={record}
          field="cashCollection"
          editingRow={editingRow}
          setEditingRow={setEditingRow}
          saveEditingRow={saveEditingRow}
        />
      ),
    },
    {
      title: "Заплатили",
      dataIndex: "paid",
      onCell: () => ({
        style: {
          padding: "16px 0px",
        },
      }),
      onHeaderCell: () => ({
        style: {
          padding: "16px 0px",
        },
      }),
      render: (_, record) => (
        <EditableNumber
          record={record}
          field="paid"
          editingRow={editingRow}
          setEditingRow={setEditingRow}
          saveEditingRow={saveEditingRow}
        />
      ),
    },
    {
      title: "Комент",
      dataIndex: "comment",
      onCell: () => ({
        style: {
          padding: "16px 0px",
        },
      }),
      onHeaderCell: () => ({
        style: {
          padding: "16px 0px",
        },
      }),
      render: (comments, record) => {
        return (
          <EditableComment
            comments={comments}
            record={record}
            setEditingRow={setEditingRow}
            operationDraft={operationDraft}
            setOperationDraft={setOperationDraft}
            saveComment={saveComment}
            editingRow={editingRow}
            removeComment={removeComment}
            updateComment={updateComment}
          />
        );
      },
    },
    {
      title: "Начислено",
      render: (_, record) =>
        `${(record.cashCollection + record.paid).toLocaleString("ru-RU")} ₽`,
      onCell: () => ({
        style: {
          borderLeft: "1px solid #d9d9d9",
        },
      }),
    },
    {
      title: "Осталось",
      render: (_, record) =>
        `${(record.salary + record.expenses - (record.cashCollection + record.paid)).toLocaleString("ru-RU")} ₽`,
    },
  ];

  console.log(months);

  if (!months) return <Spin />;
  return (
    <>
      <Table
        columns={columns}
        dataSource={[...(currentMonth?.data ?? [])]}
        rowKey="_id"
        tableLayout="auto"
        pagination={false}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default CoffeeTable;
