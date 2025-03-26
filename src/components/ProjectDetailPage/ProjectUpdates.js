import React, { useState } from "react";
import {
  Card,
  Typography,
  Empty,
  Divider,
  Modal,
  Button,
  Input,
  Pagination,
  Dropdown,
  Menu,
  Space,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import TipTapEditor from "../TipTapEditor";
import TipTapViewer from "../TipTapViewer";

const { Title, Text } = Typography;

const ProjectUpdates = ({ updates, onAddUpdate }) => {
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUpdateId, setEditUpdateId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteUpdateId, setDeleteUpdateId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleOpenModal = (update) => {
    setSelectedUpdate(update);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUpdate(null);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewContent("");
  };

  const handleAddUpdate = () => {
    if (newTitle.trim() && newContent.trim()) {
      const newUpdate = {
        id: Date.now().toString(),
        title: newTitle,
        date: new Date().toISOString(),
        content: newContent,
      };
      onAddUpdate([...updates, newUpdate]);
      handleCloseAddModal();
    }
  };

  const handleOpenEditModal = (update) => {
    setEditUpdateId(update.id);
    setEditTitle(update.title);
    setEditContent(update.content);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditUpdateId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editContent.trim()) {
      const updatedUpdates = updates.map((update) =>
        update.id === editUpdateId
          ? { ...update, title: editTitle, content: editContent }
          : update
      );
      onAddUpdate(updatedUpdates);
      handleCloseEditModal();
    }
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteUpdateId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteUpdateId(null);
  };

  const handleDeleteUpdate = () => {
    console.log("Deleting update with ID:", deleteUpdateId);

    if (!deleteUpdateId) return;

    const updatedUpdates = updates.filter(
      (update) => update.id !== deleteUpdateId
    );

    console.log("Updated updates:", updatedUpdates);

    onAddUpdate(updatedUpdates);
    handleCloseDeleteModal();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedUpdates = updates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const menu = (update) => (
    <Menu onClick={(e) => e.domEvent.stopPropagation()}>
      <Menu.Item key="edit" onClick={() => handleOpenEditModal(update)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleOpenDeleteModal(update.id)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Button
        type="primary"
        onClick={handleOpenAddModal}
        style={{ marginBottom: 16 }}
      >
        + Add Update
      </Button>

      {updates.length > 0 ? (
        <>
          {paginatedUpdates.map((update) => (
            <Card
              key={update.id}
              style={{
                marginBottom: 16,
                cursor: "pointer",
                backgroundColor: "#e5e8f2",
              }}
              hoverable
              onClick={() => handleOpenModal(update)}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <Title level={4}>{update.title}</Title>
                  <Text type="secondary">
                    {new Date(update.date).toLocaleDateString()}
                  </Text>
                </div>
                <Space>
                  <Dropdown overlay={menu(update)} trigger={["click"]}>
                    <Button
                      type="link"
                      icon={
                        <MoreOutlined
                          style={{ fontSize: "20px", color: "black" }}
                        />
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </Dropdown>
                </Space>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <div
                className="update-content"
                style={{ maxHeight: "100px", overflow: "hidden" }}
              >
                <TipTapViewer
                  content={
                    update.content.length > 200
                      ? update.content.slice(0, 200) + "..."
                      : update.content
                  }
                />
              </div>
              {update.content.length > 200 && (
                <Button
                  type="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(update);
                  }}
                >
                  Read more
                </Button>
              )}
            </Card>
          ))}
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={updates.length}
            onChange={handlePageChange}
            style={{ textAlign: "center", marginTop: 16 }}
          />
        </>
      ) : (
        <Card>
          <Empty
            description="No updates yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )}

      <Modal
        title={selectedUpdate?.title}
        open={isModalOpen}
        onCancel={handleCloseModal}
        width="60%"
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
      >
        <Text type="secondary">
          {selectedUpdate && new Date(selectedUpdate.date).toLocaleDateString()}
        </Text>
        <Divider />
        <div className="update-content">
          {selectedUpdate && <TipTapViewer content={selectedUpdate.content} />}
        </div>
      </Modal>

      <Modal
        title="Add New Update"
        open={isAddModalOpen}
        onCancel={handleCloseAddModal}
        width="60%"
        footer={[
          <Button key="cancel" onClick={handleCloseAddModal}>
            Cancel
          </Button>,
          <Button key="add" type="primary" onClick={handleAddUpdate}>
            Add Update
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <TipTapEditor content={newContent} setContent={setNewContent} />
      </Modal>

      <Modal
        title="Edit Update"
        open={isEditModalOpen}
        width="60%"
        onCancel={handleCloseEditModal}
        footer={[
          <Button key="cancel" onClick={handleCloseEditModal}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter title"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <TipTapEditor content={editContent} setContent={setEditContent} />
      </Modal>
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onCancel={handleCloseDeleteModal}
        footer={[
          <Button key="cancel" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={handleDeleteUpdate}
          >
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this update?</p>
      </Modal>
    </>
  );
};

export default ProjectUpdates;
