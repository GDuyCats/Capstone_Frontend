import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Select,
  Space,
  message,
  Popconfirm,
  Typography,
  Card,
} from "antd";
import { UserAddOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import {
  createCollaborator,
  getProjectCollaborators,
  removeCollaborator,
  fetchUserProjects,
} from "../api/apiClient";

const { Title, Text } = Typography;
const { Option } = Select;

const CollaboratorManagementPage = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const { projectId } = useParams();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const response = await fetchUserProjects();
        setProjects(response.data.data || []);

        // If projectId from URL exists, set it as selected
        if (projectId) {
          setSelectedProject(projectId);
          form.setFieldsValue({ project: projectId });
          loadCollaborators(projectId);
        }
        setLoading(false);
      } catch (error) {
        message.error("Failed to load projects");
        setLoading(false);
      }
    };

    loadProjects();
  }, [projectId, form]);

  const loadCollaborators = async (projectId) => {
    if (!projectId) return;

    try {
      setLoading(true);
      const response = await getProjectCollaborators(projectId);
      if (response.data.success) {
        setCollaborators(response.data.data || []);
      } else {
        message.error(response.data.message || "Failed to load collaborators");
      }
      setLoading(false);
    } catch (error) {
      message.error("Failed to load collaborators");
      setLoading(false);
    }
  };

  const handleProjectChange = (value) => {
    setSelectedProject(value);
    loadCollaborators(value);
  };

  const handleAddCollaborator = async (values) => {
    try {
      setLoading(true);
      const projectToUse = selectedProject || values.project;

      const response = await createCollaborator(
        values.email,
        projectToUse,
        values.role
      );

      if (response.data.success) {
        message.success("Collaborator added successfully");
        form.resetFields(["email", "role"]);
        form.setFieldsValue({ role: "EDITOR" }); // Reset to default role
        loadCollaborators(projectToUse);
      } else {
        message.error(response.data.message || "Failed to add collaborator");
      }
      setLoading(false);
    } catch (error) {
      message.error("Failed to add collaborator");
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (userId, projectId) => {
    try {
      setLoading(true);
      const response = await removeCollaborator(userId, projectId);

      if (response.data.success) {
        message.success("Collaborator removed successfully");
        loadCollaborators(projectId);
      } else {
        message.error(response.data.message || "Failed to remove collaborator");
      }
      setLoading(false);
    } catch (error) {
      message.error("Failed to remove collaborator");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: ["user", "fullname"],
      key: "fullname",
      render: (text, record) => (
        <Space>
          {record.user.avatar && (
            <img
              src={record.user.avatar}
              alt={record.user.fullname}
              style={{ width: 32, height: 32, borderRadius: "50%" }}
            />
          )}
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to remove this collaborator?"
          onConfirm={() =>
            handleRemoveCollaborator(record["user-id"], record["project-id"])
          }
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />} size="small">
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Manage Collaborators</Title>

      <Card style={{ marginBottom: "24px" }}>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleAddCollaborator}
          initialValues={{
            project: projectId,
            role: "EDITOR",
          }}
        >
          {!projectId && (
            <Form.Item
              name="project"
              label="Select Project"
              rules={[
                { required: !projectId, message: "Please select a project" },
              ]}
            >
              <Select
                placeholder="Select a project"
                onChange={handleProjectChange}
                loading={loading}
              >
                {projects.map((project) => (
                  <Option key={project["project-id"]} value={project.id}>
                    {project.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {(selectedProject || projectId) && (
            <>
              <Title level={4}>Add New Collaborator</Title>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input the email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter collaborator's email" />
              </Form.Item>

              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select a role" }]}
              >
                <Select placeholder="Select role">
                  <Option value="EDITOR">Editor</Option>
                  <Option value="VIEWER">Viewer</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  htmlType="submit"
                  loading={loading}
                >
                  Add Collaborator
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
      </Card>

      {(selectedProject || projectId) && (
        <Card title="Current Collaborators">
          <Table
            columns={columns}
            dataSource={collaborators}
            rowKey={(record) => record["user-id"]}
            loading={loading}
            pagination={false}
          />
        </Card>
      )}
    </div>
  );
};

export default CollaboratorManagementPage;
