import {
  Button,
  Divider,
  Flex,
  Popconfirm,
  Popover,
  Space,
  Typography,
} from "antd";
import {
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { formatComment } from "../../../utils/formatComment";
import dayjs from "dayjs";
import type { CoffeeRow } from "../../../types/coffee";
import type { Comment } from "../../../types/coffee";

type Props = {
  editingRow: CoffeeRow | null;
  onAdd: () => void;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
};

const CommentList = ({ editingRow, onAdd, onEdit, onDelete }: Props) => {
  return (
    <>
      <Flex
        vertical
        gap={5}
        style={{
          maxHeight: 250,
          overflowY: "auto",
        }}
      >
        {[...(editingRow?.comment ?? [])]
          .sort((a, b) => {
            if (!a.date) return 1;
            if (!b.date) return -1;

            return (
              dayjs(a.date, "D MMMM").valueOf() -
              dayjs(b.date, "D MMMM").valueOf()
            );
          })
          .map((comment, index) => {
            const formatted = formatComment(comment);
            const info =
              formatted.operation === "Другое"
                ? `Другое: ${formatted.text}`
                : `${formatted.amount} ${formatted.operation} ${formatted.date}`;

            return (
              <Flex key={comment?._id} vertical>
                {index > 0 && <Divider style={{ margin: "5px 0" }} />}

                <Flex align="center" justify="space-between">
                  <Typography.Text>{info}</Typography.Text>

                  <Space size={5}>
                    {/* редактирование комента */}
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => {
                        onEdit(comment);
                      }}
                    />

                    {/* текст комента */}
                    {formatted.operation !== "Другое" && formatted.text && (
                      <Popover
                        content={
                          <div style={{ maxWidth: 250 }}>{formatted.text}</div>
                        }
                        trigger="click"
                        getPopupContainer={(trigger) => trigger.parentElement!}
                      >
                        <Button
                          type="text"
                          size="small"
                          icon={<MessageOutlined />}
                        />
                      </Popover>
                    )}

                    {/* удаление комента */}
                    <Popconfirm
                      getPopupContainer={(trigger) => trigger.parentElement!}
                      title="Удалить комент?"
                      okText="Удалить"
                      description={
                        <div style={{ maxWidth: 250 }}>
                          <Divider style={{ margin: "5px 0" }} />

                          <p>{info}</p>

                          {formatted.operation !== "Другое" &&
                            formatted.text && (
                              <p>{`Текст: ${formatted.text}`}</p>
                            )}

                          <Divider style={{ margin: "5px 0" }} />

                          <p>Комент будет удален безвозвратно!</p>
                        </div>
                      }
                      okButtonProps={{ danger: true }}
                      onConfirm={() => {
                        onDelete(comment._id);
                      }}
                    >
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        style={{ minWidth: 24 }}
                      />
                    </Popconfirm>
                  </Space>
                </Flex>
              </Flex>
            );
          })}
      </Flex>

      {(editingRow?.comment.length ?? 0) > 0 && (
        <Divider style={{ margin: "5px 0" }} />
      )}

      <Button type="dashed" icon={<PlusOutlined />} block onClick={onAdd}>
        Добавить комментарий
      </Button>
    </>
  );
};

export default CommentList;
