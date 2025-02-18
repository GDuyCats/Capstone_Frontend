import React from "react";
import { Card, Tag, Button } from "antd";
import { Link } from "react-router-dom";

const GameCard = ({ game }) => {
  return (
    <Card
      style={{
        borderRadius: "10px",
        backgroundColor: "#E3EAFD",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
      bodyStyle={{ padding: "16px" }}
    >
      <h3>{game.name}</h3>
      <p>${game.price}</p>
      <Tag color="blue">{new Date(game.publishDatetime).toDateString()}</Tag>
      <Link to={`/game/${game.id}`}>
        <Button type="primary" style={{ marginTop: "10px" }}>
          Details
        </Button>
      </Link>
    </Card>
  );
};
export default GameCard;
