import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Layout,
  Typography,
  Row,
  Col,
  Tabs,
  Card,
  Progress,
  Statistic,
  Image,
  Carousel,
  Spin,
  Tag,
  message,
} from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import useAuth from "../components/Hooks/useAuth";
import ProjectComments from "../components/ProjectDetailPage/ProjectComments";
import ProjectUpdates from "../components/ProjectDetailPage/ProjectUpdates";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const AdminProjectDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // ✅ Kiểm tra quyền truy cập trước khi gọi API

  useEffect(() => {
    // ✅ Chặn truy cập nếu chưa kiểm tra quyền
    if (!isAuthChecked && auth?.role) {
      setIsAuthChecked(true); // Đánh dấu đã kiểm tra quyền
      if (auth.role !== "Admin") {
        message.error("Bạn không có quyền hạn để vào. Vui lòng liên hệ với admin !");
        navigate("/");
        return;
      }
    }

    // ✅ Gọi API nếu có quyền Admin
    const fetchProjectDetails = async () => {
      if (auth.role !== "Admin") return; // Nếu không phải Admin, không gọi API

      try {
        const response = await axios.get(
          `https://marvelous-gentleness-production.up.railway.app/api/Project/GetProjectById?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        console.log("✅ API Response:", response.data);

        if (response.data?.success && response.data?.data) {
          setProject(response.data.data);
        } else {
          message.error("Không tìm thấy dự án!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết dự án:", error);
        message.error("Không thể tải chi tiết dự án.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [auth, id, navigate, isAuthChecked]);

  // ✅ Nếu chưa kiểm tra quyền, hiển thị loading để tránh màn hình trắng
  if (!isAuthChecked) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
        <p>Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  // ✅ Nếu không có quyền, useEffect sẽ điều hướng trước khi đến đây.
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return (
      <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>
        Dự án không tồn tại hoặc đã bị xoá!
      </p>
    );
  }

  // ✅ Tính số ngày còn lại
  const daysLeft = Math.max(
    Math.ceil(
      (new Date(project["end-datetime"]) - new Date()) / (1000 * 60 * 60 * 24)
    ),
    0
  );

  // ✅ Tính phần trăm tiến độ tài trợ
  const progressPercentage =
    (project["total-amount"] / project["minimum-amount"]) * 100;

  return (
    <Content style={{ padding: "24px" }}>
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* ✅ Hiển thị ảnh Thumbnail */}
            <Image
              width="100%"
              src={project.thumbnail}
              alt={project.title}
              style={{ marginBottom: 20 }}
            />
          </motion.div>

          {/* ✅ Tabs chứa thông tin dự án */}
          <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
            <TabPane tab="About" key="1">
              <Paragraph>{project.description}</Paragraph>
              <div dangerouslySetInnerHTML={{ __html: project.story }} />
            </TabPane>
            <TabPane tab="Updates" key="2">
              <ProjectUpdates updates={project.updates || []} />
            </TabPane>
            <TabPane tab="Comments" key="3">
              <ProjectComments comments={[]} />
            </TabPane>
          </Tabs>
        </Col>

        <Col span={8}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* ✅ Hiển thị trạng thái dự án */}
            <Tag
              color={project.status === "ONGOING" ? "green" : "red"}
              style={{ fontSize: "16px", marginBottom: 10 }}
            >
              {project.status}
            </Tag>

            <Card>
              {/* ✅ Hiển thị tiến độ tài trợ */}
              <Progress
                percent={Math.min(progressPercentage, 100)}
                status="active"
              />

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Statistic
                    title="Pledged"
                    value={project["total-amount"]}
                    prefix="$"
                  />
                  <Text type="secondary">
                    of ${project["minimum-amount"]} goal
                  </Text>
                </Col>
                <Col span={12}>
                  <Statistic title="Backers" value={project.backers} />
                </Col>
                <Col span={12}>
                  <Statistic title="Days to go" value={daysLeft} />
                </Col>
              </Row>
            </Card>
          </motion.div>

          {/* ✅ Hiển thị danh sách phần thưởng */}
          <Title level={4} style={{ marginTop: 24 }}>
            Rewards
          </Title>
          {project.rewards?.map((reward) => (
            <motion.div
              key={reward.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card style={{ marginTop: 16 }}>
                <Title level={5}>${reward.amount} or more</Title>
                <Title level={4}>{reward.title}</Title>
                <Paragraph>{reward.description}</Paragraph>
                <Text type="secondary">
                  {reward.remainingQuantity} of {reward.limitedQuantity}{" "}
                  remaining
                </Text>
              </Card>
            </motion.div>
          ))}
        </Col>
      </Row>
    </Content>
  );
};

export default AdminProjectDetailPage;
