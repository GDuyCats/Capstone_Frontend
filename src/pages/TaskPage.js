// import React, { useEffect, useState } from "react";
// import { Layout, Card, Button } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { fetchProjectDetails } from "../api/apiClient";
// import AddBoard from "../components/Taskpage/AddBoard";
// import AddCard from "../components/Taskpage/AddCard";

// const { Content } = Layout;

// const TaskPage = ({ projectId }) => {
//   projectId = 1;
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchProjectDetails(projectId).then((response) => {
//       setProject(response.data);
//       setLoading(false);
//     });
//   }, [projectId]);

//   const handleBoardAdded = (newBoard) => {
//     setProject((prevProject) => ({
//       ...prevProject,
//       boards: [...prevProject.boards, newBoard],
//     }));
//   };

//   const handleCardAdded = (boardId, newCard) => {
//     setProject((prevProject) => ({
//       ...prevProject,
//       boards: prevProject.boards.map((board) =>
//         board.id === boardId
//           ? { ...board, cards: [...board.cards, newCard] }
//           : board
//       ),
//     }));
//   };

//   const onDragEnd = (result) => {
//     if (!result.destination) return;
//     const { source, destination } = result;
//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     )
//       return;

//     const updatedBoards = [...project.boards];
//     const boardIndex = updatedBoards.findIndex(
//       (board) => board.id.toString() === source.droppableId
//     );
//     const [movedCard] = updatedBoards[boardIndex].cards.splice(source.index, 1);
//     updatedBoards[boardIndex].cards.splice(destination.index, 0, movedCard);

//     setProject({ ...project, boards: updatedBoards });
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!project) return <div>Project not found.</div>;

//   return (
//     <Layout
//       style={{ minHeight: "100vh", background: "#f0f2f5", padding: "20px" }}
//     >
//       <Content style={{ display: "flex", gap: "16px", overflowX: "auto" }}>
//         <DragDropContext onDragEnd={onDragEnd}>
//           {project.boards.map((board) => (
//             <div
//               key={board.id}
//               style={{
//                 background: "#fff",
//                 borderRadius: "8px",
//                 padding: "16px",
//                 width: "320px",
//                 boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
//               }}
//             >
//               <h3 style={{ marginBottom: "12px", textAlign: "center" }}>
//                 {board.name}
//               </h3>
//               <Droppable droppableId={board.id.toString()}>
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     style={{ minHeight: "200px", paddingBottom: "10px" }}
//                   >
//                     {board.cards.map((card, index) => (
//                       <Draggable
//                         key={card.id}
//                         draggableId={card.id.toString()}
//                         index={index}
//                       >
//                         {(provided) => (
//                           <Card
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             style={{
//                               marginBottom: "8px",
//                               background: "#fefefe",
//                               borderRadius: "6px",
//                               boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
//                             }}
//                           >
//                             <h4>{card.title}</h4>
//                             <p>{card.description}</p>
//                           </Card>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//               <AddCard
//                 projectId={projectId}
//                 boardId={board.id}
//                 onCardAdded={(newCard) => handleCardAdded(board.id, newCard)}
//               />
//             </div>
//           ))}
//         </DragDropContext>
//         <div>
//           <AddBoard projectId={projectId} onBoardAdded={handleBoardAdded} />
//         </div>
//       </Content>
//     </Layout>
//   );
// };

// export default TaskPage;
