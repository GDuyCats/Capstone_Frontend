import { addCardToBoard } from "../../api/apiClient";
import { useState } from "react";
import { Button, Input } from "antd";

const AddCard = ({ projectId, boardId, onCardAdded }) => {
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardTitle.trim()) return;
    addCardToBoard(projectId, boardId, {
      title: cardTitle,
      description: cardDescription,
    }).then((response) => {
      onCardAdded(response.data);
      setCardTitle("");
      setCardDescription("");
    });
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <Input
        placeholder="Card Title"
        value={cardTitle}
        onChange={(e) => setCardTitle(e.target.value)}
        style={{ marginBottom: "8px" }}
      />
      <Input
        placeholder="Card Description"
        value={cardDescription}
        onChange={(e) => setCardDescription(e.target.value)}
        style={{ marginBottom: "8px" }}
      />
      <Button type="primary" onClick={handleSubmit} block>
        Add Card
      </Button>
    </div>
  );
};

export default AddCard;
