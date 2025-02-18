import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import placeholderpic from "../assets/landscape-placeholder-svgrepo-com.png";
import {
  Row,
  Col,
  Card,
  Tag,
  Button,
  Avatar,
  List,
  Typography,
  Spin,
  message,
  Image,
  Dropdown,
  Menu,
} from "antd";
import {
  FileTextOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { fetchProjectDetails } from "../api/apiClient";
import { Link } from "react-router-dom";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetchProjectDetails(id);
        setProject(response.data);
      } catch (error) {
        message.error(error.message || "Error fetching project data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <Spin tip="Loading project details..." style={{ marginTop: "20%" }} />
    );
  }

  if (!project) {
    return <Typography.Text type="danger">Project not found.</Typography.Text>;
  }

  const {
    title,
    description,
    tags,
    skills,
    members,
    status,
    apkLink,
    createdAt,
    imageUrl,
  } = project;

  const placeholderImage = placeholderpic;

  const handleMenuClick = (memberId, action) => {
    switch (action) {
      case "remove":
        message.success(`Removed member with ID: ${memberId}`);
        break;
      default:
        break;
    }
  };

  const renderMemberActions = (member) => {
    const menu = (
      <Menu onClick={({ key }) => handleMenuClick(member.id, key)}>
        <Menu.Item key="remove">Remove</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button
          type="link"
          icon={<MoreOutlined />}
          style={{ fontSize: "18px" }}
        />
      </Dropdown>
    );
  };

  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100vh",
        backgroundColor: "#E4EAF1",
      }}
    >
      <Card
        title={<Typography.Title level={4}>{title}</Typography.Title>}
        extra={
          <Tag
            color="blue"
            style={{
              background: "#CBD4F6",
              color: "#333",
              borderRadius: "8px",
            }}
          >
            {status}
          </Tag>
        }
        style={{
          borderRadius: "12px",
          border: "1px solid #D1D5DB",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          marginBottom: "24px",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={4}>
            <Image
              src={imageUrl || placeholderImage}
              style={{
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
              }}
              fallback={placeholderImage}
            />
          </Col>
          <Col span={20}>
            <Typography.Text
              style={{
                fontSize: "14px",
                fontStyle: "italic",
                color: "#6B7280",
              }}
            >
              Created at: {createdAt}
            </Typography.Text>
            <Typography.Title level={5} style={{ marginBottom: "8px" }}>
              Description:
            </Typography.Title>
            <p style={{ marginTop: "8px" }}>{description}</p>
            <div style={{ marginBottom: "10px" }}>
              {tags.map((tag, index) => (
                <Tag
                  key={index}
                  color="blue"
                  style={{
                    margin: "4px 4px 4px 0",
                    background: "#CBD4F6",
                    color: "#333",
                    borderRadius: "8px",
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
          <Col span={12}>
            <Typography.Title level={5} style={{ marginBottom: "8px" }}>
              Skill Requirements:
            </Typography.Title>
            <ul style={{ paddingLeft: "20px" }}>
              {skills.map((skill, index) => (
                <li key={index} style={{ lineHeight: "1.8" }}>
                  {skill}
                </li>
              ))}
            </ul>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ marginBottom: "8px" }}>
              Start date:
            </Typography.Title>
            <Typography.Title level={5} style={{ marginBottom: "8px" }}>
              End date:
            </Typography.Title>
          </Col>
        </Row>

        {/* APK Upload Section */}
        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
          <Col span={24}>
            <Typography.Title level={5} style={{ marginBottom: "8px" }}>
              APK:
            </Typography.Title>
            {apkLink ? (
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                href={apkLink}
                download
                style={{
                  borderRadius: "8px",
                }}
              >
                Post APK
              </Button>
            ) : (
              <Button
                type="dashed"
                icon={<PlusCircleOutlined />}
                onClick={() => alert("Upload APK functionality")}
                style={{
                  borderRadius: "8px",
                }}
              >
                Upload APK
              </Button>
            )}
          </Col>
        </Row>
      </Card>

      {/* Team Members Section */}
      <Card
        title={
          <Typography.Title level={5} style={{ marginBottom: "8px" }}>
            Members ({members.length}/5)
          </Typography.Title>
        }
        style={{
          borderRadius: "12px",
          border: "1px solid #D1D5DB",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={members}
          renderItem={(member) => (
            <List.Item actions={[renderMemberActions(member)]}>
              <List.Item.Meta
                avatar={<Avatar>{member.role}</Avatar>}
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Link to="/profile/1">{member.name}</Link>{" "}
                    {member.role === "L" && (
                      <Tag
                        color="gold"
                        style={{
                          marginLeft: "8px",
                          borderRadius: "6px",
                        }}
                      >
                        Leader
                      </Tag>
                    )}
                  </div>
                }
                description={<Typography.Text>{member.email}</Typography.Text>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ProjectDetailPage;
