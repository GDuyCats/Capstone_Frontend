import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Collapse,
  Empty,
  Spin,
  Space,
  Button,
  Divider,
  Input,
  Modal,
  message,
  Form,
  Popconfirm,
} from "antd";
import {
  QuestionCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import TipTapViewer from "../TipTapViewer";
import TipTapEditor from "../TipTapEditor";
import {
  getFaqsByProjectId,
  addFaq,
  updateFaq,
  deleteFaq,
} from "../../api/apiClient";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

const ProjectFaqs = ({ isCreator = false }) => {
  const { id } = useParams();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addFaqModalVisible, setAddFaqModalVisible] = useState(false);
  const [editFaqModalVisible, setEditFaqModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [currentFaq, setCurrentFaq] = useState(null);
  const [editAnswer, setEditAnswer] = useState("");
  const [form] = Form.useForm();
  const [expandedKeys, setExpandedKeys] = useState([]);

  useEffect(() => {
    fetchFaqs();
  }, [id]);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const response = await getFaqsByProjectId(id);
      if (response.data.success) {
        setFaqs(response.data.data || []);
      } else {
        message.error("Failed to load FAQs");
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      message.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaq = async () => {
    if (!newQuestion.trim()) {
      message.error("Question cannot be empty");
      return;
    }

    if (!newAnswer.trim()) {
      message.error("Answer cannot be empty");
      return;
    }

    setSubmitting(true);
    try {
      const response = await addFaq(id, newQuestion, newAnswer);
      if (response.data.success) {
        message.success("FAQ added successfully");
        setNewQuestion("");
        setNewAnswer("");
        setAddFaqModalVisible(false);
        await fetchFaqs();

        // Expand the newly added FAQ
        const updatedFaqs = await getFaqsByProjectId(id);
        if (updatedFaqs.data.success) {
          const newFaqIndex = updatedFaqs.data.data.findIndex(
            (faq) => faq.question === newQuestion
          );
          if (newFaqIndex !== -1) {
            setExpandedKeys([newFaqIndex.toString()]);
          }
        }
      } else {
        message.error(response.data.message || "Failed to add FAQ");
      }
    } catch (error) {
      console.error("Error adding FAQ:", error);
      message.error("Failed to add FAQ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFaq = async () => {
    if (!currentFaq) return;

    if (!editAnswer.trim()) {
      message.error("Answer cannot be empty");
      return;
    }

    setSubmitting(true);
    try {
      const response = await updateFaq(
        id,
        currentFaq.question,
        currentFaq.question,
        editAnswer
      );
      if (response.data.success) {
        message.success("FAQ updated successfully");
        setEditFaqModalVisible(false);
        await fetchFaqs();
      } else {
        message.error(response.data.message || "Failed to update FAQ");
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
      message.error("Failed to update FAQ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFaq = async (question) => {
    try {
      const response = await deleteFaq(id, question);
      if (response.data.success) {
        message.success("FAQ deleted successfully");
        await fetchFaqs();
      } else {
        message.error(response.data.message || "Failed to delete FAQ");
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      message.error("Failed to delete FAQ");
    }
  };

  const openEditModal = (faq) => {
    setCurrentFaq(faq);
    setEditAnswer(faq.answer);
    setEditFaqModalVisible(true);
  };

  const onCollapseChange = (keys) => {
    setExpandedKeys(keys);
  };

  return (
    <div className="project-faqs">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            <Space>
              <QuestionCircleOutlined />
              Frequently Asked Questions
            </Space>
          </Title>
          {isCreator && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddFaqModalVisible(true)}
            >
              Add FAQ
            </Button>
          )}
        </div>

        <Divider style={{ margin: "12px 0" }} />

        {loading ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <Spin size="default" />
          </div>
        ) : faqs.length > 0 ? (
          <Collapse
            bordered={false}
            expandIconPosition="end"
            className="faq-collapse"
            activeKey={expandedKeys}
            onChange={onCollapseChange}
          >
            {faqs.map((faq, index) => (
              <Panel
                key={index.toString()}
                header={
                  <Text strong style={{ fontSize: 16 }}>
                    {faq.question}
                  </Text>
                }
                extra={
                  isCreator && (
                    <Space onClick={(e) => e.stopPropagation()}>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(faq);
                        }}
                      />
                      <Popconfirm
                        title="Delete this FAQ?"
                        description="This action cannot be undone."
                        onConfirm={(e) => {
                          e.stopPropagation();
                          handleDeleteFaq(faq.question);
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>
                    </Space>
                  )
                }
              >
                <div className="faq-answer">
                  <TipTapViewer content={faq.answer} />
                </div>
              </Panel>
            ))}
          </Collapse>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              isCreator
                ? "No FAQs added yet. Click 'Add FAQ' to create your first FAQ."
                : "No FAQs available for this project yet."
            }
          />
        )}
      </Space>

      {/* Add FAQ Modal */}
      <Modal
        title="Add New FAQ"
        open={addFaqModalVisible}
        onCancel={() => setAddFaqModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddFaqModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            onClick={handleAddFaq}
          >
            Add FAQ
          </Button>,
        ]}
        width={800}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Question"
            required
            rules={[{ required: true, message: "Please enter a question" }]}
          >
            <Input
              placeholder="Enter your question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Answer"
            required
            rules={[{ required: true, message: "Please enter an answer" }]}
          >
            <div
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: 2,
                padding: "4px",
              }}
            >
              <TipTapEditor content={newAnswer} setContent={setNewAnswer} />
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit FAQ Modal */}
      <Modal
        title="Edit FAQ Answer"
        open={editFaqModalVisible}
        onCancel={() => setEditFaqModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditFaqModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            onClick={handleEditFaq}
          >
            Update Answer
          </Button>,
        ]}
        width={800}
      >
        {currentFaq && (
          <Form layout="vertical">
            <Form.Item label="Question">
              <Input value={currentFaq.question} disabled />
              <Text type="secondary" style={{ display: "block", marginTop: 4 }}>
                Questions cannot be edited once created
              </Text>
            </Form.Item>
            <Form.Item
              label="Answer"
              required
              rules={[{ required: true, message: "Please enter an answer" }]}
            >
              <div
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: 2,
                  padding: "4px",
                }}
              >
                <TipTapEditor content={editAnswer} setContent={setEditAnswer} />
              </div>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ProjectFaqs;
