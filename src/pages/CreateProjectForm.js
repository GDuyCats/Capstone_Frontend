import React, { useState, useEffect } from "react";
import {
  Steps,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  message,
  Card,
  Upload,
  Select,
  Tag,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  createProject,
  updateThumbnail,
  updateStory,
  fetchAllCategories,
  addCategoryToProject,
} from "../api/apiClient";
import TipTapEditor from "../components/TipTapEditor";

const { Step } = Steps;

const CreateProjectForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [storyContent, setStoryContent] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchAllCategories();
        setAllCategories(response.data.data || []);
      } catch (error) {
        message.error("Failed to load categories");
        console.error(error);
      }
    };

    loadCategories();
  }, []);
  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields();
        const values = form.getFieldsValue();
        const formattedValues = {
          Title: values.title,
          Description: values.description,
          MinimumAmount: parseFloat(values.minimumAmount).toString(),
          StartDatetime: values.startDatetime.toISOString(),
          EndDatetime: values.endDatetime.toISOString(),
        };

        setLoading(true);
        const response = await createProject(formattedValues);
        const projectId =
          response.data["project-id"] || response.data?.data?.["project-id"];
        setProjectId(projectId);

        await Promise.all(
          selectedCategories.map((categoryId) =>
            addCategoryToProject(projectId, categoryId)
          )
        );
        message.success("Project created successfully!");
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.error("Error creating project:", error.response?.data);
        message.error(
          error.response?.data?.message || "Failed to create project"
        );
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 1) {
      try {
        setLoading(true);
        if (thumbnailFile) {
          await updateThumbnail(projectId, thumbnailFile);
          message.success("Thumbnail uploaded successfully!");
        }
        setCurrentStep(currentStep + 1);
      } catch (error) {
        message.error("Failed to upload thumbnail");
        throw error;
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 2) {
      try {
        setLoading(true);
        if (storyContent) {
          await updateStory(projectId, storyContent);
          message.success("Story updated successfully!");
        }
        message.success("Project setup completed!");
        form.resetFields();
        setCurrentStep(currentStep + 1);
        setStoryContent("");
        setThumbnailFile(null);
      } catch (error) {
        message.error("Failed to update story");
        throw error;
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 3) {
      try {
        setLoading(true);
        if (selectedCategories.length > 0 && projectId) {
          await Promise.all(
            selectedCategories.map((categoryId) =>
              addCategoryToProject(projectId, categoryId)
            )
          );
          message.success("Categories added successfully!");
        }
        message.success("Project setup completed!");
        form.resetFields();
        setCurrentStep(0);
        setProjectId(null);
        setStoryContent("");
        setThumbnailFile(null);
        setSelectedCategories([]);
      } catch (error) {
        message.error("Failed to complete project setup");
        throw error;
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: "Basic Info",
      content: (
        <Form form={form} layout="vertical">
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
            rules={[
              { required: true, message: "Please enter a minimum amount" },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="startDatetime"
            rules={[{ required: true, message: "Please select a start date" }]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              inputReadOnly={true}
            />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDatetime"
            rules={[{ required: true, message: "Please select an end date" }]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              inputReadOnly={true}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Upload Thumbnail",
      content: (
        <div>
          <Upload
            beforeUpload={(file) => {
              setThumbnailFile(file);
              return false;
            }}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Select Thumbnail Image</Button>
          </Upload>
          <p style={{ marginTop: 16 }}>
            <Button type="link" onClick={handleNext}>
              Skip this step
            </Button>
          </p>
        </div>
      ),
    },
    {
      title: "Write Story",
      content: (
        <div>
          <TipTapEditor content={storyContent} setContent={setStoryContent} />
          <p style={{ marginTop: 16 }}>
            <Button type="link" onClick={() => setCurrentStep(currentStep + 1)}>
              Skip this step
            </Button>
          </p>
        </div>
      ),
    },
    {
      title: "Categories",
      content: (
        <div>
          <h3>Select Project Categories</h3>
          <Select
            mode="multiple"
            placeholder="Select categories"
            value={selectedCategories}
            onChange={setSelectedCategories}
            optionLabelProp="label"
            style={{ width: "100%" }}
          >
            {allCategories.map((category) => (
              <Select.Option
                key={category["category-id"]}
                value={category["category-id"]}
                label={category.name}
              >
                {category.name}
              </Select.Option>
            ))}
          </Select>
          <div style={{ marginTop: 16 }}>
            {selectedCategories.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {selectedCategories.map((catId) => {
                  const category = allCategories.find(
                    (c) => c["category-id"] === catId
                  );
                  return (
                    <Tag key={catId} color="blue">
                      {category?.name || "Unknown"}
                    </Tag>
                  );
                })}
              </div>
            ) : (
              <span style={{ color: "#999" }}>No categories selected</span>
            )}
          </div>
          <p style={{ marginTop: 16 }}>
            <Button type="link" onClick={handleNext}>
              Skip this step
            </Button>
          </p>
        </div>
      ),
    },
  ];

  return (
    <Card
      title="Create New Project"
      style={{ maxWidth: 800, margin: "auto", padding: 20 }}
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className="steps-content">
        {steps[currentStep]?.content || <p>Something went wrong</p>}
      </div>
      <div className="steps-action" style={{ marginTop: 24 }}>
        {currentStep > 0 && currentStep !== 1 && (
          <Button style={{ marginRight: 8 }} onClick={handlePrev}>
            Previous
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button type="primary" onClick={handleNext} loading={loading}>
            Next
          </Button>
        ) : (
          <Button type="primary" onClick={handleNext} loading={loading}>
            Complete
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CreateProjectForm;
