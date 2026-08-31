import {
  Button,
  DatePicker,
  Flex,
  Input,
  InputNumber,
  message,
  Select,
  Typography,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { operationOptions } from "../../../constants/operationOptions";
import dayjs from "dayjs";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { OperationDraft } from "../../../types/coffee";

type Props = {
  onList: () => void;
  operationDraft: OperationDraft;
  setOperationDraft: Dispatch<SetStateAction<OperationDraft>>;
  saveComment: () => void;
};

const AddComment = ({
  onList,
  operationDraft,
  setOperationDraft,
  saveComment,
}: Props) => {
  const [pickerValue, setPickerValue] = useState(dayjs());

  const handleSave = () => {
    if (
      operationDraft.type === "other"
        ? !operationDraft.text
        : !operationDraft.type || !operationDraft.date || !operationDraft.amount
    ) {
      message.error("Заполните обязательные поля!");
      return;
    }

    saveComment();
    onList();
  };

  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Text strong>Добавить комментарий</Typography.Text>

        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={onList}
        />
      </Flex>

      {/* Select + DatePicker */}
      <Flex gap={5}>
        <Select
          getPopupContainer={(trigger) => trigger.parentElement!}
          style={{ flex: 1 }}
          size="small"
          value={operationDraft.type}
          options={operationOptions}
          onChange={(operation) =>
            setOperationDraft((prev) => ({
              ...prev,
              type: operation,
              ...(operation === "other" && {
                date: null,
                amount: 0,
              }),
            }))
          }
        />

        {operationDraft.type !== "other" && (
          <DatePicker
            getPopupContainer={(trigger) => trigger.parentElement!}
            size="small"
            placeholder="День:"
            style={{ flex: 1 }}
            placement="bottomLeft"
            format="D MMMM"
            defaultPickerValue={pickerValue}
            onPanelChange={(value) => setPickerValue(value)}
            value={
              operationDraft.date ? dayjs(operationDraft.date, "D MMMM") : null
            }
            onChange={(day) =>
              setOperationDraft((prev) => ({
                ...prev,
                date: day ? day.format("D MMMM") : null,
              }))
            }
            status={!operationDraft.date ? "error" : ""}
          />
        )}
      </Flex>

      {/* Input + InputNumber */}
      <Flex gap={5}>
        <Input
          placeholder="Комент:"
          size="small"
          maxLength={80}
          showCount
          value={operationDraft.text}
          onChange={(e) =>
            setOperationDraft((prev) => ({
              ...prev,
              text: e.target.value,
            }))
          }
          status={
            operationDraft.type === "other" && !operationDraft.text
              ? "error"
              : undefined
          }
        />

        {operationDraft.type !== "other" && (
          <InputNumber
            min={0}
            placeholder="Сумма:"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽"
            }
            value={operationDraft.amount}
            onChange={(num) =>
              setOperationDraft((prev) => ({
                ...prev,
                amount: num ?? 0,
              }))
            }
            size="small"
            style={{ width: "80px", flexShrink: 0 }}
            status={!operationDraft.amount ? "error" : ""}
          />
        )}
      </Flex>

      {/* Сохранить */}
      <Button type="primary" block onClick={handleSave}>
        Сохранить
      </Button>
    </>
  );
};

export default AddComment;
