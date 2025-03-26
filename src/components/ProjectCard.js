import React from "react";
import { Card, Tag, Button, Row, Col, Progress, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const ProjectCard = ({ project }) => {
  const daysLeft = Math.ceil(
    (new Date(project["end-datetime"]) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const progressPercentage =
    (project["total-amount"] / project["minimum-amount"]) * 100;

  const thumbnail =
    project.thumbnail ||
    "https://paper.vn/wp-content/uploads/2023/11/placeholder-1-1-1.png";

  const truncateDescription = (text, charLimit) => {
    if (!text) return "";
    return text.length > charLimit
      ? text.substring(0, charLimit) + "..."
      : text;
  };

  return (
    <Card
      hoverable
      cover={
        <img
          alt={project?.title}
          src={thumbnail}
          style={{
            height: 150,
            objectFit: "cover",

            borderBottom: "1px solid #ddd",
          }}
        />
      }
      style={{
        height: "100%",
        backgroundColor: "#e1eeec",
        border: "1px solid #ddd",
      }}
    >
      <Title level={4}>{project?.title}</Title>
      <Text type="secondary">by {project?.creator}</Text>

      <Text style={{ display: "block", margin: "16px 0", minHeight: "50px" }}>
        {truncateDescription(project?.description, 100)}
      </Text>

      <Progress
        percent={Math.min(progressPercentage, 100)}
        status="active"
        strokeColor="#52c41a"
      />

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Title level={4}>
            ${project["total-amount"]?.toLocaleString() || 0}
          </Title>
          <Text type="secondary">
            pledged of ${project["minimum-amount"]?.toLocaleString() || 0}
          </Text>
        </Col>
        <Col span={8}>
          <Title level={4}>{project?.backers?.toLocaleString() || 0}</Title>
          <Text type="secondary">backers</Text>
        </Col>
        <Col span={8}>
          <Title level={4}>{daysLeft}</Title>
          <Text type="secondary">days to go</Text>
        </Col>
      </Row>

      <Button
        type="primary"
        style={{ marginTop: 16, border: "black solid 0.2px" }}
      >
        <Link to={`/project/${project["project-id"]}`}>View Project</Link>
      </Button>
    </Card>
  );
};

export default ProjectCard;
