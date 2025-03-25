import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  message,
  Card,
} from "antd";
import { createProject } from "../api/apiClient";

const CreateProjectForm = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        title: values.title,
        description: values.description,
        "minimum-amount": values.minimumAmount,
        "start-datetime": values.startDatetime.toISOString(),
        "end-datetime": values.endDatetime.toISOString(),
      };
      await createProject(formattedValues);
      message.success("Project created successfully!");
    } catch (error) {
      message.error("Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Create New Project"
      style={{ maxWidth: 500, margin: "auto", padding: 20 }}
    >
      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter project title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea placeholder="Enter project description" rows={4} />
        </Form.Item>

        <Form.Item
          label="Minimum Amount"
          name="minimumAmount"
          rules={[{ required: true, message: "Please enter a minimum amount" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDatetime"
          rules={[{ required: true, message: "Please select a start date" }]}
        >
          <DatePicker showTime style={{ width: "100%" }} inputReadOnly={true} />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDatetime"
          rules={[{ required: true, message: "Please select an end date" }]}
        >
          <DatePicker showTime style={{ width: "100%" }} inputReadOnly={true} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Project
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateProjectForm;
