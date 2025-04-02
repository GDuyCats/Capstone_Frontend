import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjectsAdmin, staffApproveProject } from "../api/apiClient";
import {
  Table,
  Input,
  Typography,
  Tag,
  Button,
  message,
  Modal,
  Select,
  Tooltip,
} from "antd";
import { EyeOutlined, CheckOutlined } from "@ant-design/icons";
import placeholder from "../assets/placeholder-1-1-1.png";

const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

const InvisibleProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [status, setStatus] = useState("ONGOING");
  const [reason, setReason] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetchProjectsAdmin();
      const filteredProjects = response.data.data.filter(
        (p) => p.status === "INVISIBLE"
      );
      setProjects(filteredProjects || []);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const getStatusTag = (status) => {
    const statusColors = {
      INVISIBLE: "red",
      ONGOING: "green",
      HALTED: "orange",
    };
    return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
  };

  const handleApproveClick = (project) => {
    setSelectedProject(project);
    setIsModalVisible(true);
  };

  const handleApprove = async () => {
    if (!selectedProject) return;

    setLoading(true);
    try {
      await staffApproveProject({
        projectId: selectedProject["project-id"],
        status,
        reason,
      });
      message.success("Project status updated successfully");
      fetchProjects();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating project status", error);
      message.error("Failed to update project status");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Image",
      dataIndex: "thumbnail",
      render: (thumbnail) => (
        <img
          src={
            !thumbnail || thumbnail === "Null" || thumbnail.trim() === ""
              ? placeholder
              : thumbnail
          }
          alt="Thumbnail"
          className="w-32 h-20 rounded-lg shadow-md object-cover"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Start Date",
      dataIndex: "start-datetime",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "end-datetime",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Min Amount",
      dataIndex: "minimum-amount",
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Actions",
      render: (record) => (
        <div className="flex items-center space-x-2">
          <Tooltip title="View details">
            <Button
              type="text"
              icon={
                <EyeOutlined style={{ color: "#1890ff", fontSize: "20px" }} />
              }
              onClick={() => navigate(`/staff/project/${record["project-id"]}`)}
              className="hover:bg-gray-100 rounded"
            />
          </Tooltip>
          <Tooltip title="Approve project">
            <Button
              type="primary"
              shape="round"
              icon={<CheckOutlined />}
              size="small"
              onClick={() => handleApproveClick(record)}
              style={{
                background: "#52c41a",
                borderColor: "#52c41a",
              }}
            >
              Approve
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <Title level={3} className="mb-4 text-gray-700">
        Invisible Projects
      </Title>
      <div className="mb-4">
        <Search
          placeholder="Search project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          enterButton
          className="w-1/2"
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredProjects}
        rowKey={(record) => record["project-id"]}
        className="border rounded-lg shadow-sm"
      />

      <Modal
        title="Approve Project"
        visible={isModalVisible}
        onOk={handleApprove}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Status</label>
            <Select value={status} onChange={setStatus} className="w-full">
              <Option value="ONGOING">ONGOING</Option>
              <Option value="HALTED">HALTED</Option>
            </Select>
          </div>
          <div>
            <label className="block mb-2">Reason (optional)</label>
            <Input.TextArea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for approval"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvisibleProjects;
