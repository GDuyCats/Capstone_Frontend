import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjectsAdmin } from "../api/apiClient";
import { Table, Input, Select, Typography, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import placeholder from "../assets/placeholder-1-1-1.png";

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const ApprovedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetchProjectsAdmin();
      const filteredProjects = response.data.data.filter((p) =>
        ["ONGOING", "HALTED"].includes(p.status)
      );
      setProjects(filteredProjects || []);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const getStatusTag = (status) => {
    const statusColors = {
      ONGOING: "blue",
      HALTED: "orange",
    };
    return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
  };

  const filteredProjects = projects.filter(
    (p) =>
      (!statusFilter || p.status === statusFilter) &&
      p.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Image",
      dataIndex: "thumbnail",
      render: (thumbnail) => (
        <img
          src={
            !thumbnail || thumbnail === "Unknown" || thumbnail.trim() === ""
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
      title: "Action",
      render: (record) => (
        <EyeOutlined
          className="text-blue-500 cursor-pointer text-lg"
          onClick={() => navigate(`/staff/project/${record["project-id"]}`)}
        />
      ),
    },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <Title level={3} className="mb-4 text-gray-700">
        Approved Projects
      </Title>
      <div className="flex gap-4 mb-4 items-center">
        <Search
          placeholder="Search project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          enterButton
          className="w-1/2"
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-48 border-gray-300 rounded-md"
        >
          <Option value="">All</Option>
          <Option value="ONGOING">Ongoing</Option>
          <Option value="HALTED">Paused</Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={filteredProjects}
        rowKey={(record) => record["project-id"]}
        className="border rounded-lg shadow-sm"
      />
    </div>
  );
};

export default ApprovedProjects;
