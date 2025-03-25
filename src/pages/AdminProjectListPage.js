import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchProjects, deleteProject } from "../api/apiClient";
import dayjs from "dayjs";

const AdminProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects()
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  const handleDelete = (id) => {
    deleteProject(id)
      .then(() => {
        message.success("Project deleted successfully!");
        setProjects((prev) => prev.filter((project) => project.id !== id));
      })
      .catch(() => message.error("Failed to delete project"));
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Creator", dataIndex: "creator", key: "creator" },
    {
      title: "Funding Progress",
      key: "funding",
      render: (_, record) => `${record.currentAmount} / ${record.goalAmount}`,
    },
    { title: "Backers", dataIndex: "backers", key: "backers" },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const isEnded = new Date(record.endDate) < new Date();
        return (
          <Tag color={isEnded ? "red" : "green"}>
            {isEnded ? "Ended" : "Active"}
          </Tag>
        );
      },
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/admin/project/${record.id}`)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={projects}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      style={{ cursor: "pointer" }}
    />
  );
};

export default AdminProjectListPage;
