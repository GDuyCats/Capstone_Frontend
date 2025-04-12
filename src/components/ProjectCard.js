import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card, Tag, Button, Row, Col, Progress, Typography, Spin } from "antd";
import { Link } from "react-router-dom";
import placeholder from "../assets/placeholder-1-1-1.png";
import { fetchProjectCategories } from "../api/apiClient";

const { Title, Text } = Typography;

const categoriesCache = {};

const ProjectCard = ({ project }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const mountedRef = useRef(true);

  const { statusText, daysValue, progressPercentage } = useMemo(() => {
    const now = new Date();
    const startDate = new Date(project["start-datetime"]);
    const endDate = new Date(project["end-datetime"]);

    let statusText;
    let daysValue;

    if (now < startDate) {
      const daysUntilStart = Math.ceil(
        (startDate - now) / (1000 * 60 * 60 * 24)
      );
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

    const progressPercentage = (
      (project["total-amount"] / project["minimum-amount"]) *
      100
    ).toFixed(1);

    return { statusText, daysValue, progressPercentage };
  }, [project]);

  useEffect(() => {
    mountedRef.current = true;

    const loadCategories = async () => {
      const projectId = project["project-id"];
      if (categoriesCache[projectId]) {
        setCategories(categoriesCache[projectId]);
        return;
      }

      try {
        setLoadingCategories(true);
        const response = await fetchProjectCategories(projectId);
        const categoriesData = response.data.data || [];
        categoriesCache[projectId] = categoriesData;
        if (mountedRef.current) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error(
          `Failed to load categories for project ${projectId}`,
          error
        );
      } finally {
        if (mountedRef.current) {
          setLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      mountedRef.current = false;
    };
  }, [project]);

  const thumbnail = useMemo(() => {
    return project.thumbnail === "Unknown" || !project.thumbnail
      ? placeholder
      : project.thumbnail;
  }, [project.thumbnail]);

  const truncatedDescription = useMemo(() => {
    if (!project?.description) return "";
    const charLimit = 100;
    return project.description.length > charLimit
      ? project.description.substring(0, charLimit) + "..."
      : project.description;
  }, [project?.description]);

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
          loading="lazy"
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

      {loadingCategories ? (
        <Spin size="small" style={{ margin: "8px 0" }} />
      ) : (
        categories.length > 0 && (
          <div
            style={{
              margin: "8px 0",
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            {categories.slice(0, 3).map((category) => (
              <Tag key={category["category-id"]} color="blue">
                {category.name}
              </Tag>
            ))}
            {categories.length > 3 && <Tag>+{categories.length - 3}</Tag>}
          </div>
        )
      )}

      <Text style={{ display: "block", margin: "16px 0", minHeight: "50px" }}>
        {truncatedDescription}
      </Text>

      <Progress
        percent={Math.min(progressPercentage, 100)}
        status="active"
        strokeColor="#52c41a"
      />

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Title level={4}>
            {project["total-amount"]?.toLocaleString() || 0}$
          </Title>
          <Text type="secondary">
            pledged of {project["minimum-amount"]?.toLocaleString() || 0}$
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

export default React.memo(ProjectCard);
