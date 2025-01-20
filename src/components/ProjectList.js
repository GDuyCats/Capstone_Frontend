import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Pagination } from "antd";
import ProjectCard from "./ProjectCard";
import { fetchProjects } from "../api/apiClient";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  useEffect(() => {
    fetchProjects()
      .then((response) => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setLoading(false);
      });
  }, []);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const paginatedProjects = projects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) return <Spin size="large" />;

  return (
    <div>
      <Row gutter={[16, 16]}>
        {paginatedProjects.map((project) => (
          <Col key={project?.id} xs={24} sm={12} md={8}>
            <ProjectCard project={project} />
          </Col>
        ))}
      </Row>

      <Row justify="center" style={{ marginTop: "20px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={projects.length}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={["6", "12", "18", "24"]}
        />
      </Row>
    </div>
  );
};

export default ProjectList;
