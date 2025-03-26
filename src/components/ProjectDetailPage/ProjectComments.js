import React, { useState } from "react";
import { List, Avatar, Button, Input, Form, Typography, Card } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Text } = Typography;

const ProjectComments = ({ comments, onAddComment, onEditComment }) => {
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [currentPage, setCurrentPage] = useState(1); //Thêm state trang hiện tại
  const pageSize = 5; // Số bình luận mỗi trang

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment("");
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditText(comment.content);
  };

  const handleSaveEdit = (commentId) => {
    onEditComment(commentId, editText);
    setEditingComment(null);
  };

  // Tính toán dữ liệu của trang hiện tại
  const indexOfLastComment = currentPage * pageSize;
  const indexOfFirstComment = indexOfLastComment - pageSize;
  const currentComments = comments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 4 }}>
      <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: 16 }}>
        Comments
      </h3>

      <List
        dataSource={currentComments} // Chỉ hiển thị bình luận thuộc trang hiện tại
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: comments.length,
          onChange: (page) => setCurrentPage(page), // Cập nhật state khi đổi trang
        }}
        renderItem={(comment) => (
          <Card
            style={{
              borderRadius: 12,
              marginBottom: 12,
              background: "#f9f9f9",
            }}
          >
            <List.Item
              actions={[
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEditComment(comment)}
                  style={{ color: "#1890ff" }}
                >
                  Edit
                </Button>,
              ]}
              style={{ padding: 2 }}
            >
              <List.Item.Meta
                avatar={<Avatar src={comment.avatar} size={40} />}
                title={
                  <Text style={{ fontSize: "16px", fontWeight: "500" }}>
                    {comment.name}
                  </Text>
                }
                description={
                  <>
                    {editingComment?.id === comment.id ? (
                      <TextArea
                        rows={2}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                    ) : (
                      <Text style={{ fontSize: "14px" }}>
                        {comment.content}
                      </Text>
                    )}
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                      {new Date(comment.date).toLocaleString()}{" "}
                      {comment.edited && <Text type="secondary">(Edited)</Text>}
                    </div>
                    {editingComment?.id === comment.id && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleSaveEdit(comment.id)}
                        style={{ marginTop: 4 }}
                      >
                        Save
                      </Button>
                    )}
                  </>
                }
              />
            </List.Item>
          </Card>
        )}
      />

      <Card style={{ borderRadius: 12, padding: 16, background: "#fff" }}>
        <Form onFinish={handleAddComment}>
          <TextArea
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            style={{ borderRadius: 8 }}
          />
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginTop: 8,
              width: "150px",
              height: 40,
              fontSize: "16px",
              borderRadius: 8,
              background: "#1890ff",
              border: "none",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Add Comment
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ProjectComments;
