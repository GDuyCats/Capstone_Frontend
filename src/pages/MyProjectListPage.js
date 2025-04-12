import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchUserProjects,
  deleteProject,
  fetchProjectCategories,
} from "../api/apiClient";
import { Button, Table, Modal, message, Space, Tag } from "antd";
import placeholder from "../assets/placeholder-1-1-1.png";
import RewardList from "../components/MyProjectListPage/RewardList";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;

const MyProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const navigate = useNavigate();

  const fetchAllProjectsWithCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchUserProjects();
      const projectsData = response.data.data || [];

      const projectsWithCategories = await Promise.all(
        projectsData.map(async (project) => {
          try {
            const categoriesResponse = await fetchProjectCategories(
              project["project-id"]
            );
            return {
              ...project,
              categories: categoriesResponse.data.data || [],
            };
          } catch (error) {
            console.error(
              `Failed to load categories for project ${project["project-id"]}`,
              error
            );
            return {
              ...project,
              categories: [],
            };
          }
        })
      );

      setProjects(projectsWithCategories);
    } catch (error) {
      message.error("Failed to fetch projects");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllProjectsWithCategories();
  }, [fetchAllProjectsWithCategories]);

  const handleEdit = useCallback(
    (projectId) => {
      navigate(`/edit-project/${projectId}`);
    },
    [navigate]
  );

  const handleDelete = useCallback((projectId) => {
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
          setProjects((prevProjects) =>
            prevProjects.filter(
              (project) => project["project-id"] !== projectId
            )
          );
        } catch (error) {
          message.error("Failed to delete project");
          console.error(error);
        }
      },
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "Thumbnail",
        dataIndex: "thumbnail",
        key: "thumbnail",
        render: (thumbnail) => (
          <img
            src={
              !thumbnail || thumbnail === "Unknown" || thumbnail.trim() === ""
                ? placeholder
                : thumbnail
            }
            alt="Thumbnail"
            style={{
              width: 200,
              height: 100,
              objectFit: "cover",
              borderRadius: 5,
            }}
          />
        ),
      },
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
        render: (amount) => `${amount.toLocaleString()}$`,
      },
      {
        title: "Categories",
        dataIndex: "categories",
        key: "categories",
        render: (categories) => (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {categories?.length > 0 ? (
              categories.map((category) => (
                <Tag key={category["category-id"]} color="blue">
                  {category.name}
                </Tag>
              ))
            ) : (
              <span style={{ color: "#999" }}>No categories</span>
            )}
          </div>
        ),
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
    ],
    [handleEdit, handleDelete]
  );

  const handleExpand = (expanded, record) => {
    setExpandedRowKeys(expanded ? [record["project-id"]] : []);
  };

  return (
    <div>
      <h1>My Projects</h1>
      <Table
        columns={columns}
        dataSource={projects}
        rowKey="project-id"
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <RewardList projectId={record["project-id"]} />
          ),
          expandedRowKeys: expandedRowKeys,
          onExpand: handleExpand,
        }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default React.memo(MyProjectList);
