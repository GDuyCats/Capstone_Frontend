import React from "react";
import { Card, Tag, Button, Row, Col, Avatar } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const GameCard = ({ game }) => {
  const maxMembers = 5;
  const memberCount = game?.members?.length || 0;
  const displayedMembers = game?.members?.slice(0, maxMembers) || [];

  return (
    <Card
      style={{
        borderRadius: "10px",
        backgroundColor: "#E3EAFD",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
      bodyStyle={{ padding: "16px" }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col span={6}>
          <Avatar
            shape="square"
            size={64}
            src={game?.thumbnail}
            icon={<FileTextOutlined />}
            style={{
              border: "1px solid #ccc",
              backgroundColor: "#f5f5f5",
            }}
          />
        </Col>

        <Col span={18}>
          <h3 style={{ margin: 0 }}>{game?.title}</h3>
          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
            Created by: <strong>{game?.creator}</strong>
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
            Members:{" "}
            <strong>
              {memberCount}/{maxMembers}
            </strong>{" "}
          </p>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col span={24}>
          <p style={{ fontSize: "12px", color: "#333" }}>
            <FileTextOutlined style={{ marginRight: "5px" }} />
            {game?.description}
          </p>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <div style={{ marginTop: "10px" }}>
            {game?.tags?.map((tag, index) => (
              <Tag
                key={index}
                color="blue"
                style={{
                  margin: "2px",
                  background: "#CBD4F6",
                  color: "#333",
                  borderRadius: "8px",
                }}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </Col>
      </Row>

      <Row justify="end" style={{ marginTop: "10px" }}>
        <Link to={`/game/${game?.id}`}>
          <Button type="primary">Detail</Button>
        </Link>
      </Row>
    </Card>
  );
};
export default GameCard;
