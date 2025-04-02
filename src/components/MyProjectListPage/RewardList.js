import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import {
  fetchRewardsByProjectId,
  addReward,
  updateReward,
  deleteReward,
} from "../../api/apiClient";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;

const RewardList = ({ projectId }) => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    setLoading(true);
    try {
      const response = await fetchRewardsByProjectId(projectId);
      setRewards(response.data.data || []);
    } catch (error) {
      message.error("Failed to fetch rewards");
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = (reward) => {
    setEditingReward(reward);
    form.setFieldsValue(reward);
    setIsModalVisible(true);
  };

  const handleDelete = (rewardId) => {
    confirm({
      title: "Are you sure you want to delete this reward?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteReward(rewardId);
          message.success("Reward deleted successfully");
          loadRewards();
        } catch (error) {
          message.error("Failed to delete reward");
        }
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      const rewardData = {
        ...values,
        "project-id": projectId,
        "created-datetime": new Date().toISOString(),
      };

      if (editingReward) {
        await updateReward(editingReward["reward-id"], rewardData);
        message.success("Reward updated successfully");
      } else {
        await addReward(rewardData);
        message.success("Reward added successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingReward(null);
      loadRewards();
    } catch (error) {
      message.error("Operation failed");
    }
  };

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${amount}đ`,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
    {
      title: "Created At",
      dataIndex: "created-datetime",
      key: "created-datetime",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record["reward-id"])}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Rewards</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
      >
        Add Reward
      </Button>
      <Table
        columns={columns}
        dataSource={rewards}
        rowKey="reward-id"
        loading={loading}
      />

      <Modal
        title={editingReward ? "Edit Reward" : "Add Reward"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please enter amount" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="details"
            label="Details"
            rules={[{ required: true, message: "Please enter details" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RewardList;
