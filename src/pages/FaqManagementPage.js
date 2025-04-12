import React, { useState, useEffect } from "react";
import {
  fetchUserProjects,
  getFaqsByProjectId,
  addFaq,
  updateFaq,
  deleteFaq,
} from "../api/apiClient";
import TipTapEditor from "../components/TipTapEditor";
import TipTapViewer from "../components/TipTapViewer";
import { useNavigate } from "react-router-dom";
import {
  Select,
  Button,
  Input,
  Card,
  Typography,
  Divider,
  List,
  Space,
  Modal,
  Spin,
  Tag,
  Row,
  Col,
  Empty,
  Avatar,
  Tooltip,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const FaqManagementPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editAnswer, setEditAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingFaq, setAddingFaq] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchFaqs(selectedProjectId);
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetchUserProjects();
      if (response.data.success) {
        setProjects(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedProjectId(response.data.data[0]["project-id"]);
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      message.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchFaqs = async (projectId) => {
    setLoading(true);
    try {
      const response = await getFaqsByProjectId(projectId);
      if (response.data.success) {
        setFaqs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      message.error("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      message.warning("Both question and answer are required");
      return;
    }

    try {
      await addFaq(selectedProjectId, newQuestion, newAnswer);
      setNewQuestion("");
      setNewAnswer("");
      setAddingFaq(false);
      message.success("FAQ added successfully");
      fetchFaqs(selectedProjectId);
    } catch (error) {
      console.error("Error adding FAQ:", error);
      message.error("Failed to add FAQ");
    }
  };

  const startEditing = (faq) => {
    setEditingId(faq.question);
    setEditAnswer(faq.answer);
  };

  const handleUpdateFaq = async () => {
    if (!editAnswer.trim()) {
      message.warning("Answer cannot be empty");
      return;
    }

    try {
      await updateFaq(selectedProjectId, editingId, editingId, editAnswer);
      setEditingId(null);
      message.success("FAQ updated successfully");
      fetchFaqs(selectedProjectId);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      message.error("Failed to update FAQ");
    }
  };

  const showDeleteConfirm = (question) => {
    confirm({
      title: "Are you sure you want to delete this FAQ?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeleteFaq(question);
      },
    });
  };

  const handleDeleteFaq = async (question) => {
    try {
      await deleteFaq(selectedProjectId, question);
      message.success("FAQ deleted successfully");
      fetchFaqs(selectedProjectId);
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      message.error("Failed to delete FAQ");
    }
  };

  const handleProjectChange = (value) => {
    setSelectedProjectId(Number(value));
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "INVISIBLE":
        return <Tag color="default">Invisible</Tag>;
      case "HALTED":
        return <Tag color="red">Halted</Tag>;
      case "ONGOING":
        return <Tag color="blue">On going</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const selectedProject = projects.find(
    (p) => p["project-id"] === selectedProjectId
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderProjectInfo = () => {
    if (!selectedProject) return null;

    return (
      <Card className="project-info-card">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Avatar
              style={{ width: "250px", height: "150px" }}
              src={selectedProject.thumbnail}
              shape="square"
              icon={!selectedProject.thumbnail && <QuestionCircleOutlined />}
            />
          </Col>
          <Col span={18}>
            <Space direction="vertical" size="small">
              <Title level={4}>{selectedProject.title}</Title>
              <Space size="middle">
                {getStatusTag(selectedProject.status)}
                <Tooltip title="End Date">
                  <Space>
                    <ClockCircleOutlined />
                    <Text>{formatDate(selectedProject["end-datetime"])}</Text>
                  </Space>
                </Tooltip>
                <Tooltip title="Total Amount">
                  <Space>
                    <DollarOutlined />
                    <Text>{selectedProject["total-amount"]}</Text>
                  </Space>
                </Tooltip>
              </Space>
              <Button
                type="default"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/project/${selectedProjectId}`)}
              >
                View Project
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div className="faq-management-page">
      <Title level={2}>FAQ Management</Title>

      <Card>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row align="middle" justify="space-between">
            <Col span={16}>
              <Text strong>Select Project:</Text>
              <Select
                style={{ width: 300, marginLeft: 8 }}
                value={selectedProjectId || undefined}
                onChange={handleProjectChange}
                disabled={loading}
                loading={loading}
                placeholder="Select a project"
              >
                {projects.map((project) => (
                  <Option
                    key={project["project-id"]}
                    value={project["project-id"]}
                  >
                    {project.title} {getStatusTag(project.status)}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={8} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setAddingFaq(true)}
                disabled={!selectedProjectId}
              >
                Add New FAQ
              </Button>
            </Col>
          </Row>
        </Space>
      </Card>

      {loading && (
        <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
      )}

      {selectedProjectId && !loading && (
        <>
          {renderProjectInfo()}

          <Divider orientation="left">
            <Space>
              <QuestionCircleOutlined />
              FAQs for {selectedProject?.title}
            </Space>
          </Divider>

          {faqs.length === 0 ? (
            <Empty description="No FAQs found for this project" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={faqs}
              renderItem={(faq) => (
                <List.Item
                  key={faq.question}
                  actions={[
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => startEditing(faq)}
                      disabled={editingId !== null}
                    >
                      Edit Answer
                    </Button>,
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteConfirm(faq.question)}
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <List.Item.Meta title={<Text strong>{faq.question}</Text>} />
                  {editingId === faq.question ? (
                    <div className="edit-answer-section">
                      <TipTapEditor
                        content={editAnswer}
                        setContent={setEditAnswer}
                      />
                      <div style={{ marginTop: 16, textAlign: "right" }}>
                        <Space>
                          <Button onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                          <Button type="primary" onClick={handleUpdateFaq}>
                            Save Changes
                          </Button>
                        </Space>
                      </div>
                    </div>
                  ) : (
                    <div className="answer-viewer">
                      <TipTapViewer content={faq.answer} />
                    </div>
                  )}
                </List.Item>
              )}
            />
          )}
        </>
      )}

      <Modal
        title="Add New FAQ"
        open={addingFaq}
        onCancel={() => setAddingFaq(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddingFaq(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleAddFaq}
            disabled={!newQuestion.trim() || !newAnswer.trim()}
          >
            Add FAQ
          </Button>,
        ]}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Question:</Text>
          <Input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter question"
            style={{ marginTop: 8 }}
          />
        </div>
        <div>
          <Text strong>Answer:</Text>
          <div
            style={{
              marginTop: 8,
              border: "1px solid #d9d9d9",
              borderRadius: 2,
            }}
          >
            <TipTapEditor content={newAnswer} setContent={setNewAnswer} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FaqManagementPage;
