import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProjects, deleteProject } from "../api/apiClient";
import { Button, Table, Modal, message, Space } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;

const MyProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetchUserProjects();
      setProjects(response.data.data || []);
    } catch (error) {
      message.error("Failed to fetch projects");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (projectId) => {
    navigate(`/edit-project/${projectId}`);
  };

  const handleDelete = (projectId) => {
    confirm({
      title: "Are you sure you want to delete this project?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteProject(projectId);
          message.success("Project deleted successfully");
          loadProjects();
        } catch (error) {
          message.error("Failed to delete project");
          console.error(error);
        }
      },
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color: status === "VISIBLE" ? "green" : "orange",
            fontWeight: "bold",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "End Date",
      dataIndex: "end-datetime",
      key: "end-datetime",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Total Amount",
      dataIndex: "total-amount",
      key: "total-amount",
      render: (amount) => `$${amount.toLocaleString()}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record["project-id"])}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record["project-id"])}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>My Projects</h2>
      <Table
        columns={columns}
        dataSource={projects}
        rowKey="project-id"
        loading={loading}
      />
    </div>
  );
};

export default MyProjectList;
