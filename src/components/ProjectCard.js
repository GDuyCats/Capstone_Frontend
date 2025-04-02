import React from "react";
import { Card, Tag, Button, Row, Col, Progress, Typography } from "antd";
import { Link } from "react-router-dom";
import placeholder from "../assets/placeholder-1-1-1.png";
const { Title, Text } = Typography;

const ProjectCard = ({ project }) => {
  const now = new Date();
  const startDate = new Date(project["start-datetime"]);
  const endDate = new Date(project["end-datetime"]);

  let statusText;
  let daysValue;

  if (now < startDate) {
    const daysUntilStart = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
    statusText = "Starts in";
    daysValue = daysUntilStart;
  } else if (now >= startDate && now <= endDate) {
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    statusText = "Days to go";
    daysValue = daysRemaining;
  } else {
    statusText = "Ended";
    daysValue = 0;
  }
  const progressPercentage =
    (project["total-amount"] / project["minimum-amount"]) * 100;

  const thumbnail = project.thumbnail || placeholder;

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
          <Title level={4}>{daysValue}</Title>
          <Text type="secondary">{statusText}</Text>
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
