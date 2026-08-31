import { Button, Flex, Popover, Typography } from "antd";
import { MessageOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState, type Dispatch, type SetStateAction } from "react";
import CommentList from "./CommentList";
import AddComment from "./CommentAdd";
import EditComment from "./CommentEdit";
import type { CoffeeRow, OperationDraft } from "../../../types/coffee";
import type { Comment } from "../../../types/coffee";

type Props = {
  comments: Comment[];
  record: CoffeeRow;
  setEditingRow: Dispatch<SetStateAction<CoffeeRow | null>>;
  operationDraft: OperationDraft;
  setOperationDraft: Dispatch<SetStateAction<OperationDraft>>;
  saveComment: () => void;
  editingRow: CoffeeRow | null;
  removeComment: (commentId: string) => void;
  updateComment: (commentDraft: Comment) => Promise<void>;
};

const EditableComment = ({
  comments,
  record,
  setEditingRow,
  operationDraft,
  setOperationDraft,
  saveComment,
  editingRow,
  removeComment,
  updateComment,
}: Props) => {
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  return (
    <Flex vertical gap={4} align="flex-start">
      <Flex gap={10}>
        <Typography.Text>
          <MessageOutlined /> {comments.length}
        </Typography.Text>

        <Popover
          trigger="click"
          styles={{ root: { position: "fixed" } }}
          onOpenChange={(open) => {
            if (open) {
              setEditingRow(record);
            } else {
              setEditingRow(null);
            }
          }}
          content={
            <Flex vertical gap={5} style={{ width: 300 }}>
              {mode === "list" && (
                <CommentList
                  editingRow={editingRow}
                  onAdd={() => setMode("add")}
                  onEdit={(comment) => {
                    setEditingComment(comment);
                    setMode("edit");
                  }}
                  onDelete={removeComment}
                />
              )}

              {mode === "edit" && editingComment && (
                <EditComment
                  onList={() => setMode("list")}
                  comment={editingComment}
                  onSave={(commentDraft) => {
                    updateComment(commentDraft);
                  }}
                />
              )}
              {mode === "add" && (
                <AddComment
                  onList={() => setMode("list")}
                  operationDraft={operationDraft}
                  setOperationDraft={setOperationDraft}
                  saveComment={saveComment}
                />
              )}
            </Flex>
          }
        >
          <Button
            size="small"
            onClick={() => {
              setOperationDraft({
                type: "paid",
                amount: 0,
                text: "",
                date: dayjs().format("D MMMM"),
              });
              setMode("list");
            }}
          >
            <EditOutlined />
          </Button>
        </Popover>
      </Flex>
    </Flex>
  );
};

export default EditableComment;
