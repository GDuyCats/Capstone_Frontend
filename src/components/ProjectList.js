import React, { useEffect, useState, useCallback } from "react";
import {
  Row,
  Col,
  Spin,
  Pagination,
  Empty,
  Alert,
  Select,
  message,
} from "antd";
import ProjectCard from "./ProjectCard";
import { fetchProjects, fetchAllCategories } from "../api/apiClient";
import { apiAuth } from "../api/apiClient";

const { Option } = Select;

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const sortProjectsByStatus = (projects) => {
    const now = new Date();

    return [...projects].sort((a, b) => {
      const aStart = new Date(a["start-datetime"]);
      const aEnd = new Date(a["end-datetime"]);
      const bStart = new Date(b["start-datetime"]);
      const bEnd = new Date(b["end-datetime"]);

      const aStatus = now < aStart ? 2 : now > aEnd ? 1 : 0;
      const bStatus = now < bStart ? 2 : now > bEnd ? 1 : 0;

      return aStatus - bStatus;
    });
  };
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const [projectsResponse, categoriesResponse] = await Promise.all([
        fetchProjects(),
        fetchAllCategories(),
      ]);

      const projectsData = projectsResponse?.data?.data || [];
      const sortedData = sortProjectsByStatus(projectsData);
      setProjects(sortedData);
      setFilteredProjects(sortedData);

      const categoriesData = categoriesResponse?.data?.data || [];
      setCategories(categoriesData);

      setError(null);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setError(
        "Đã xảy ra lỗi khi kết nối với máy chủ dữ liệu. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Hàm filter projects theo category
  const filterProjectsByCategory = useCallback(
    (categoryId) => {
      if (!categoryId) {
        setFilteredProjects(projects); // Nếu không chọn category thì hiển thị tất cả
        return;
      }

      // Gọi API để lấy projects theo category
      const fetchProjectsByCategory = async () => {
        try {
          setLoading(true);
          const response = await apiAuth.get(
            `/api/Category/GetAllProjectByCategoryId?categoryId=${categoryId}`
          );
          const filteredData = response?.data?.data || [];
          setFilteredProjects(filteredData);
        } catch (error) {
          console.error("Lỗi khi lọc dự án theo danh mục:", error);
          message.error("Lỗi khi lọc dự án theo danh mục");
        } finally {
          setLoading(false);
        }
      };

      fetchProjectsByCategory();
    },
    [projects]
  );

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1); // Reset về trang đầu tiên khi filter
    filterProjectsByCategory(value);
  };

  const handlePageChange = (page, pageSizeValue) => {
    setCurrentPage(page);
    setPageSize(pageSizeValue);
    window.scrollTo(0, 0);
  };

  const paginatedProjects = filteredProjects.slice(
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

  return (
    <div>
      {/* Thêm dropdown chọn category */}
      <div style={{ marginBottom: 20 }}>
        <Select
          style={{ width: 200 }}
          placeholder="Select category"
          onChange={handleCategoryChange}
          value={selectedCategory}
          allowClear
        >
          <Option value={null}>All categories</Option>
          {categories.map((category) => (
            <Option
              key={category["category-id"]}
              value={category["category-id"]}
            >
              {category.name}
            </Option>
          ))}
        </Select>
      </div>

      {filteredProjects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Empty description="No projects found" />
        </div>
      ) : (
        <>
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
              total={filteredProjects.length}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["6", "12", "18", "24"]}
            />
          </Row>
        </>
      )}
    </div>
  );
};

export default React.memo(ProjectList);
