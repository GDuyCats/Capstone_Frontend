import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { Table, Button, Space, message, Tag, Image } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../components/Hooks/useAuth";
import dayjs from "dayjs";

const AdminProjectListPage = () => {
  const { auth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // if (auth?.role !== "Admin"){
    //   navigate("/")
    //   message.error("Bạn không có quyền hạn để vào. Vui lòng liên hệ với admin !");
    //   return;
    // }
    
    const fetchProjects = async () => {
      if (!auth?.token) {
        return;
      }
      try {
        const response = await axios.get(
          "https://marvelous-gentleness-production.up.railway.app/api/Project/GetAllProject",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        console.log("✅ API Response:", response.data);

        if (Array.isArray(response.data?.data)) {
          setProjects(response.data.data);
        } else {
          console.error("Dữ liệu không hợp lệ:", response.data);
          setProjects([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dự án:", error);
        message.error("Không thể tải danh sách dự án.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [auth, navigate]);

  // 🗑️ Xử lý xóa dự án
  const handleDelete = async (projectId) => {
    Modal.confirm({
      title: "Xác nhận xóa dự án",
      content: "Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác!",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axios.delete(
            `https://marvelous-gentleness-production.up.railway.app/api/Project/DeleteProject?id=${projectId}`,
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );

          message.success("✅ Project deleted successfully!");
          setProjects((prev) =>
            prev.filter((project) => project["project-id"] !== projectId)
          );
        } catch (error) {
          console.error("Lỗi khi xóa dự án:", error);
          message.error("Failed to delete project");
        }
      },
    });
  };

  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (url) => <Image width={80} src={url} alt="Project Thumbnail" />,
    },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Creator", dataIndex: "creator", key: "creator" },
    {
      title: "Funding Progress",
      key: "funding",
      render: (_, record) =>
        `${record["total-amount"]} / ${record["minimum-amount"]}`,
    },
    { title: "Backers", dataIndex: "backers", key: "backers" },
    {
      title: "Start Date",
      dataIndex: "start-datetime",
      key: "start-datetime",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "end-datetime",
      key: "end-datetime",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "ONGOING" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={(e) => {
              e.stopPropagation(); // ✅ Ngăn sự kiện click trên dòng
              navigate(`/admin/project/${record["project-id"]}`);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            onClick={(e) => {
              e.stopPropagation(); // ✅ Ngăn sự kiện click trên dòng
              handleDelete(record["project-id"]);
            }}
          >
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
      rowKey="project-id"
      loading={loading}
      pagination={{ pageSize: 10 }}
      style={{ cursor: "pointer" }}
      // ✅ Thêm sự kiện click vào dòng để chuyển trang
      onRow={(record) => ({
        onClick: () => navigate(`/admin/project/${record["project-id"]}`),
      })}
    />
  );
};

export default AdminProjectListPage;
