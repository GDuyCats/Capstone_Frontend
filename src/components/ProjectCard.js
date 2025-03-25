import React from "react";
import { Card, Tag, Button, Row, Col, Progress, Typography } from "antd";
import { Link } from "react-router-dom";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ProjectCard = ({ project }) => {
  const daysLeft = Math.ceil(
    (new Date(project?.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const progressPercentage =
    (project?.currentAmount / project?.goalAmount) * 100;

  return (
    <Card
      hoverable
      cover={
        <img
          alt={project?.title}
          src={project?.thumbnail}
          style={{ height: 100, objectFit: "cover" }}
        />
      }
      style={{ height: "100%" }}
    >
      <Title level={4}>{project?.title}</Title>
      <Text type="secondary">by {project?.creator}</Text>

      <Text style={{ display: "block", margin: "16px 0" }}>
        {project?.description?.length > 150
          ? `${project?.description?.substring(0, 150)}...`
          : project?.description}
      </Text>

      <Progress percent={Math.min(progressPercentage, 100)} status="active" />

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Title level={4}>${project?.currentAmount?.toLocaleString()}</Title>
          <Text type="secondary">
            pledged of ${project?.goalAmount?.toLocaleString()}
          </Text>
        </Col>
        <Col span={8}>
          <Title level={4}>{project?.backers?.toLocaleString()}</Title>
          <Text type="secondary">backers</Text>
        </Col>
        <Col span={8}>
          <Title level={4}>{daysLeft}</Title>
          <Text type="secondary">days to go</Text>
        </Col>
      </Row>

      <Row style={{ marginTop: 16 }}>
        {project?.tags?.map((tag) => (
          <Tag key={tag} color="blue" style={{ margin: 4 }}>
            {tag}
          </Tag>
        ))}
      </Row>

      <Button type="primary" style={{ marginTop: 16 }}>
        <Link to={`/project/${project?.id}`}>View Project</Link>
      </Button>
    </Card>
  );
};
export default ProjectCard;
