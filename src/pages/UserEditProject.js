import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProject,
  updateProject,
  updateThumbnail,
  updateStory,
} from "../api/apiClient";
import {
  Button,
  Form,
  Input,
  DatePicker,
  Upload,
  message,
  Spin,
  Select,
  Image,
  Card,
  Divider,
  Row,
  Col,
  Space,
} from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import TipTapEditor from "../components/TipTapEditor";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

const UserEditProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [storyLoaded, setStoryLoaded] = useState(false);
  const [updatingBasic, setUpdatingBasic] = useState(false);
  const [updatingThumbnail, setUpdatingThumbnail] = useState(false);
  const [updatingStory, setUpdatingStory] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const response = await fetchProject(projectId);
        const project = response.data.data;
        form.setFieldsValue({
          title: project.title,
          description: project.description,
          startDatetime: moment(project["start-datetime"]),
          endDatetime: moment(project["end-datetime"]),
          status: project.status,
          "minimum-amount": project["minimum-amount"],
        });

        setStory(project.story || "");
        setStoryLoaded(true);
        setCurrentThumbnail(project.thumbnail);
      } catch (error) {
        message.error("Failed to fetch project details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, form]);

  const handleUpdateThumbnail = async () => {
    if (!thumbnail) {
      message.warning("Please select a new thumbnail first");
      return;
    }

    try {
      setUpdatingThumbnail(true);
      await updateThumbnail(projectId, thumbnail);
      setCurrentThumbnail(URL.createObjectURL(thumbnail));
      message.success("Thumbnail updated successfully");
      setThumbnail(null);
    } catch (error) {
      message.error("Failed to update thumbnail");
      console.error(error);
    } finally {
      setUpdatingThumbnail(false);
    }
  };

  const handleUpdateStory = async () => {
    if (!story) {
      message.warning("Story content cannot be empty");
      return;
    }

    try {
      setUpdatingStory(true);
      await updateStory(projectId, story);
      message.success("Story updated successfully");
    } catch (error) {
      message.error("Failed to update story");
      console.error(error);
    } finally {
      setUpdatingStory(false);
    }
  };

  const handleUpdateBasicInfo = async (values) => {
    try {
      setUpdatingBasic(true);
      const payload = {
        ...values,
        "start-datetime": values.startDatetime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        "end-datetime": values.endDatetime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        "minimum-amount": values["minimum-amount"],
      };

      await updateProject(projectId, payload);
      message.success("Project information updated successfully");
    } catch (error) {
      message.error("Failed to update project information");
      console.error(error);
    } finally {
      setUpdatingBasic(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Edit Project</h1>
      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Basic Information" bordered={false}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateBasicInfo}
                initialValues={{ status: "INVISIBLE" }}
              >
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[
                    { required: true, message: "Please input project title!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input project description!",
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>

                <Form.Item
                  label="Minimum Amount"
                  name="minimum-amount"
                  rules={[
                    { required: true, message: "Please input minimum amount!" },
                    {
                      pattern: /^[0-9]+$/,
                      message: "Please input a valid number!",
                    },
                  ]}
                >
                  <Input type="number" prefix="$" />
                </Form.Item>

                <Form.Item
                  label="Start Date"
                  name="startDatetime"
                  rules={[
                    { required: true, message: "Please select start date!" },
                  ]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: "100%" }}
                    disabledDate={(current) => {
                      return current && current < moment().startOf("day");
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="End Date"
                  name="endDatetime"
                  rules={[
                    { required: true, message: "Please select end date!" },
                  ]}
                  dependencies={["startDatetime"]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: "100%" }}
                    disabledDate={(current) => {
                      const startDate = form.getFieldValue("startDatetime");
                      return startDate
                        ? current && current < startDate.startOf("day")
                        : current && current < moment().startOf("day");
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: "Please select status!" }]}
                >
                  <Select>
                    <Option value="VISIBLE">Visible</Option>
                    <Option value="INVISIBLE">Invisible</Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={updatingBasic}
                    icon={<SaveOutlined />}
                  >
                    Save Basic Information
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title="Project Thumbnail"
              bordered={false}
              style={{ marginBottom: 24 }}
            >
              {currentThumbnail && (
                <div style={{ marginBottom: 16, textAlign: "center" }}>
                  <Image
                    src={currentThumbnail}
                    alt="Current Thumbnail"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 300,
                      borderRadius: 8,
                      border: "1px solid #f0f0f0",
                    }}
                  />
                </div>
              )}

              <Space direction="vertical" style={{ width: "100%" }}>
                <Upload
                  accept="image/*"
                  beforeUpload={(file) => {
                    setThumbnail(file);
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button block icon={<UploadOutlined />}>
                    Select New Thumbnail
                  </Button>
                </Upload>

                {thumbnail && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      backgroundColor: "#fafafa",
                      borderRadius: 8,
                      border: "1px dashed #d9d9d9",
                    }}
                  >
                    <span>{thumbnail.name}</span>
                    <Button
                      type="primary"
                      onClick={handleUpdateThumbnail}
                      loading={updatingThumbnail}
                      size="small"
                    >
                      Update
                    </Button>
                  </div>
                )}
              </Space>
            </Card>

            <Card title="Project Story" bordered={false}>
              {storyLoaded && (
                <TipTapEditor
                  content={story}
                  setContent={setStory}
                  key={`editor-${projectId}`}
                />
              )}
              <Button
                type="primary"
                onClick={handleUpdateStory}
                loading={updatingStory}
                icon={<SaveOutlined />}
                style={{ marginTop: 16 }}
                block
              >
                Update Story
              </Button>
            </Card>
          </Col>
        </Row>

        <Divider />

        <div style={{ textAlign: "right" }}>
          <Button
            type="default"
            onClick={() => navigate("/my-projects")}
            style={{ marginRight: 8 }}
          >
            Back to Projects
          </Button>
          <Button
            type="primary"
            onClick={() => {
              handleUpdateBasicInfo(form.getFieldsValue());
              if (thumbnail) handleUpdateThumbnail();
              handleUpdateStory();
            }}
            loading={updatingBasic || updatingThumbnail || updatingStory}
          >
            Save All Changes
          </Button>
        </div>
      </Spin>
    </div>
  );
};

export default UserEditProject;
