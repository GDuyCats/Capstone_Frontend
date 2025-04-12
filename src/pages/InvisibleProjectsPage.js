import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  Spin,
} from "antd";
import { EyeOutlined, CheckOutlined } from "@ant-design/icons";
import placeholder from "../assets/placeholder-1-1-1.png";

const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

const ProjectImage = React.memo(({ thumbnail }) => (
  <img
    src={
      !thumbnail || thumbnail === "Unknown" || thumbnail.trim() === ""
        ? placeholder
        : thumbnail
    }
    alt="Thumbnail"
    className="w-32 h-20 rounded-lg shadow-md object-cover"
    loading="lazy"
  />
));

// Status tag component
const StatusTag = React.memo(({ status }) => {
  const statusColors = {
    INVISIBLE: "red",
    ONGOING: "green",
    HALTED: "orange",
  };
  return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
});

const InvisibleProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [status, setStatus] = useState("ONGOING");
  const [reason, setReason] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    setTableLoading(true);
    try {
      const response = await fetchProjectsAdmin();
      const filteredProjects = response.data.data.filter(
        (p) => p.status === "INVISIBLE"
      );
      setProjects(filteredProjects || []);
      setPagination((prev) => ({
        ...prev,
        total: filteredProjects.length,
      }));
    } catch (error) {
      console.error("Error fetching projects", error);
      message.error("Failed to load projects");
    } finally {
      setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleApproveClick = useCallback((project) => {
    setSelectedProject(project);
    setIsModalVisible(true);
  }, []);

  const handleApprove = useCallback(async () => {
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
      setReason(""); // Reset form
    } catch (error) {
      console.error("Error updating project status", error);
      message.error("Failed to update project status");
    } finally {
      setLoading(false);
    }
  }, [selectedProject, status, reason, fetchProjects]);

  const handleTableChange = useCallback((pagination) => {
    setPagination(pagination);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    // Reset to first page when searching
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  }, []);

  const filteredProjects = useMemo(
    () =>
      projects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      ),
    [projects, search]
  );

  const columns = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "thumbnail",
        render: (thumbnail) => <ProjectImage thumbnail={thumbnail} />,
      },
      {
        title: "Title",
        dataIndex: "title",
        // Enable sorting for faster finding
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status) => <StatusTag status={status} />,
      },
      {
        title: "Start Date",
        dataIndex: "start-datetime",
        render: (text) => new Date(text).toLocaleDateString(),
        sorter: (a, b) =>
          new Date(a["start-datetime"]) - new Date(b["start-datetime"]),
      },
      {
        title: "End Date",
        dataIndex: "end-datetime",
        render: (text) => new Date(text).toLocaleDateString(),
        sorter: (a, b) =>
          new Date(a["end-datetime"]) - new Date(b["end-datetime"]),
      },
      {
        title: "Min Amount",
        dataIndex: "minimum-amount",
        render: (amount) => `${amount.toLocaleString()} VND`,
        sorter: (a, b) => a["minimum-amount"] - b["minimum-amount"],
      },
      {
        title: "Actions",
        render: (_, record) => (
          <div className="flex items-center space-x-2">
            <Tooltip title="View details">
              <Button
                type="text"
                icon={
                  <EyeOutlined style={{ color: "#1890ff", fontSize: "20px" }} />
                }
                onClick={() =>
                  navigate(`/staff/project/${record["project-id"]}`)
                }
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
    ],
    [navigate, handleApproveClick]
  );

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
    setReason("");
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <Title level={3} className="mb-4 text-gray-700">
        Invisible Projects
      </Title>
      <div className="mb-4">
        <Search
          placeholder="Search project..."
          value={search}
          onChange={handleSearchChange}
          enterButton
          className="w-1/2"
          allowClear
        />
      </div>

      <Spin spinning={tableLoading}>
        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey={(record) => record["project-id"]}
          className="border rounded-lg shadow-sm"
          pagination={pagination}
          onChange={handleTableChange}
          // Add virtual scrolling for large datasets
          scroll={{ x: "max-content" }}
        />
      </Spin>

      <Modal
        title="Approve Project"
        open={isModalVisible}
        onOk={handleApprove}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        destroyOnClose
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

export default React.memo(InvisibleProjects);
