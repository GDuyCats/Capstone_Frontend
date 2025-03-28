import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Tag, Image } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 👉 Import axios để gọi API
import useAuth from "../components/Hooks/useAuth"; // 👉 Lấy token từ AuthContext
import dayjs from "dayjs";

const AdminProjectListPage = () => {
  const { auth } = useAuth(); // ✅ Lấy token từ AuthContext
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Thêm state loading
  const navigate = useNavigate();

  // 📌 Gọi API lấy danh sách dự án
  useEffect(() => {
    const fetchProjects = async () => {
      if (!auth?.token) {
        console.error("❌ Không tìm thấy token!");
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

        // Kiểm tra dữ liệu trả về có phải mảng không
        if (Array.isArray(response.data?.data)) {
          setProjects(response.data.data);
        } else {
          console.error("❌ Dữ liệu không hợp lệ:", response.data);
          setProjects([]); // Nếu dữ liệu không hợp lệ, đặt danh sách rỗng
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách dự án:", error);
        message.error("Không thể tải danh sách dự án.");
      } finally {
        setLoading(false); // ✅ Tắt loading sau khi API chạy xong
      }
    };

    fetchProjects();
  }, [auth]);

  // 🗑️ Xử lý xóa dự án
  const handleDelete = async (projectId) => {
    try {
      await axios.delete(
        `https://marvelous-gentleness-production.up.railway.app/api/Project/Delete/${projectId}`,
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
      console.error("❌ Lỗi khi xóa dự án:", error);
      message.error("Failed to delete project");
    }
  };

  // 🏗️ Cấu hình cột cho bảng
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
            onClick={() =>
              navigate(`/admin/project/${record["project-id"]}`)
            }
          >
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record["project-id"])}>
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
      rowKey="project-id" // ✅ Đổi key theo API
      loading={loading} // ✅ Hiển thị loading trong khi tải dữ liệu
      pagination={{ pageSize: 10 }}
      style={{ cursor: "pointer" }}
    />
  );
};

export default AdminProjectListPage;
