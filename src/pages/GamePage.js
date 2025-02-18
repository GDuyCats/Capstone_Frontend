import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Pagination } from "antd";
import GameCard from "../components/GameCard";
import { fetchGames } from "../api/apiClient";

const GamePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    fetchGames()
      .then((response) => {
        setGames(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
        setLoading(false);
      });
  }, []);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const paginatedGames = games.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) return <Spin size="large" />;

  return (
    <div>
      <Row gutter={[16, 16]}>
        {paginatedGames.map((game) => (
          <Col key={game?.id} xs={24} sm={12} md={8}>
            <GameCard game={game} />
          </Col>
        ))}
      </Row>

      <Row justify="center" style={{ marginTop: "20px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={games.length}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={["6", "12", "18", "24"]}
        />
      </Row>
    </div>
  );
};
export default GamePage;
