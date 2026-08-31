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
import { useState } from "react";
import dayjs from "dayjs";
import type { Comment } from "../../../types/coffee";

type Props = {
  onList: () => void;
  comment: Comment;
  onSave: (commentDraft: Comment) => void;
};

const EditComment = ({ onList, comment, onSave }: Props) => {
  const [commentDraft, setCommentDraft] = useState({
    _id: comment._id,
    amount: comment.amount,
    date: comment.date,
    operation: comment.operation,
    text: comment.text,
  });

  const [pickerValue, setPickerValue] = useState(
    comment.date ? dayjs(comment.date, "D MMMM") : dayjs(),
  );

  const isChanged =
    commentDraft.amount !== comment.amount ||
    commentDraft.date !== comment.date ||
    commentDraft.operation !== comment.operation ||
    commentDraft.text !== comment.text;

  const isValid =
    commentDraft.operation === "other"
      ? !!commentDraft.text
      : !!commentDraft.date && !!commentDraft.amount;

  // !!!! что делать с "нечего"
  const handleSave = () => {
    if (!isValid) {
      message.error("Заполни обязательные поля!");
      return;
    }

    if (!isChanged) {
      message.info("Изменений нет!");
      return;
    }

    const updatedDraft =
      commentDraft.operation === "other"
        ? {
            ...commentDraft,
            date: null,
            amount: 0,
          }
        : commentDraft;

    setCommentDraft(updatedDraft);
    onSave(updatedDraft);
    onList();
  };

  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Text strong>Редактировать комментарий</Typography.Text>

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
          value={commentDraft.operation}
          options={operationOptions}
          onChange={(operation) =>
            setCommentDraft((prev) => ({
              ...prev,
              operation,
              ...(operation !== "other" &&
                !prev.date && {
                  date: dayjs().format("D MMMM"),
                }),
            }))
          }
        />

        {commentDraft.operation !== "other" && (
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
              commentDraft.date ? dayjs(commentDraft.date, "D MMMM") : null
            }
            onChange={(day) =>
              setCommentDraft((prev) => ({
                ...prev,
                date: day ? day.format("D MMMM") : null,
              }))
            }
            status={!commentDraft.date ? "error" : ""}
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
          value={commentDraft.text}
          onChange={(e) =>
            setCommentDraft((prev) => ({
              ...prev,
              text: e.target.value,
            }))
          }
          status={
            commentDraft.operation === "other" && !commentDraft.text
              ? "error"
              : undefined
          }
        />

        {commentDraft.operation !== "other" && (
          <InputNumber
            min={0}
            placeholder="Сумма:"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽"
            }
            value={commentDraft.amount}
            onChange={(num) =>
              setCommentDraft((prev) => ({
                ...prev,
                amount: num ?? 0,
              }))
            }
            size="small"
            style={{ width: "80px", flexShrink: 0 }}
            status={!commentDraft.amount ? "error" : ""}
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

export default EditComment;
