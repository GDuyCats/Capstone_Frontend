import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Spin, Result, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CreatorProfile from "../components/CreatorProfile";
import { fetchCreatorInfo } from "../api/apiClient";

const CreatorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy state từ location nếu có
  const fromPath = location.state?.from || "/projects";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCreatorInfo(id);
        if (response.data.success) {
          setCreator(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate(fromPath);
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Result status="error" title="Error" subTitle={error} />;
  if (!creator) return <Result status="404" title="Creator not found" />;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        style={{ marginBottom: 16 }}
      >
        {fromPath.includes("/project/")
          ? "Back to project"
          : "Back to projects"}
      </Button>
      <CreatorProfile creator={creator} />
    </div>
  );
};

export default CreatorProfilePage;
