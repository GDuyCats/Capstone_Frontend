import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Pagination, Empty, Alert } from "antd";
import ProjectCard from "./ProjectCard";
import { fetchProjects } from "../api/apiClient";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    fetchProjects()
      .then((response) => {
        if (response?.data?.success) {
          setProjects(response.data.data);
        } else {
          setError("Không thể tải danh sách dự án.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách dự án:", error);
        setError(
          "Đã xảy ra lỗi khi kết nối với máy chủ dữ liệu. Vui lòng thử lại sau."
        );
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

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "50px 0",
        }}
      >
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );

  if (projects.length === 0)
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Empty description="Không có dự án nào" />
      </div>
    );

  return (
    <div>
      <Row gutter={[16, 16]}>
        {paginatedProjects.map((project) => (
          <Col key={project["project-id"]} xs={24} sm={12} md={8}>
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
