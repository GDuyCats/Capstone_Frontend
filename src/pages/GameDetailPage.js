import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Typography, Spin, Tag, Image, Button } from "antd";
import { fetchGameDetails } from "../api/apiClient";

const GameDetailPage = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameDetails(id)
      .then((response) => {
        setGame(response.data);
      })
      .catch((error) => {
        console.error("Error fetching game details:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <Spin tip="Loading game details..." style={{ marginTop: "20%" }} />;
  if (!game)
    return <Typography.Text type="danger">Game not found.</Typography.Text>;

  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100vh",
        backgroundColor: "#E4EAF1",
      }}
    >
      <Card
        title={<Typography.Title level={4}>{game.name}</Typography.Title>}
        extra={<Tag color="blue">${game.price}</Tag>}
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          marginBottom: "24px",
        }}
      >
        <Image
          src={game.imageUrl}
          style={{ width: "100%", borderRadius: "8px" }}
        />
        <Typography.Paragraph style={{ marginTop: "16px" }}>
          {game.details}
        </Typography.Paragraph>
        <Typography.Text type="secondary">
          Published: {new Date(game.publishDatetime).toDateString()}
        </Typography.Text>
      </Card>
      <Button type="primary" style={{ marginTop: "16px" }}>
        Buy Now
      </Button>
    </div>
  );
};

export default GameDetailPage;
