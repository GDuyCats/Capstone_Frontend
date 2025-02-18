import { addBoardToProject } from "../../api/apiClient";
import { useState } from "react";
import { Button, Input } from "antd";

const AddBoard = ({ projectId, onBoardAdded }) => {
  const [boardName, setBoardName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!boardName.trim()) return;
    addBoardToProject(projectId, { name: boardName }).then((response) => {
      onBoardAdded(response.data);
      setBoardName("");
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Input
        placeholder="Board Name"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        style={{ marginBottom: "8px" }}
      />
      <Button type="primary" onClick={handleSubmit} block>
        Add Board
      </Button>
    </div>
  );
};

export default AddBoard;
