import React, { useState, useEffect, useRef } from "react";
import { Button, Typography, Row, Col, Spin, message } from "antd";
import { FiUpload, FiImage, FiLoader, FiTrash2 } from "react-icons/fi";
import { uploadFile, getUserFiles, deleteFile } from "../api/apiClient";

const { Title, Text } = Typography;

const FileManagerPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
    try {
      setLoading(true);
      const auth = JSON.parse(localStorage.getItem("auth"));

      if (!auth?.token) {
        console.error("No auth token found");
        return;
      }

      const userId = auth.id;
      if (!userId) {
        console.error("No user ID found");
        return;
      }

      const response = await getUserFiles(userId);

      if (response.data?.success) {
        const images =
          response.data.data?.listData ||
          response.data.data?.["list-data"] ||
          response.data.data ||
          [];
        setFiles(images);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      message.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingFile(file);
      const response = await uploadFile(file);

      if (response.data?.success) {
        message.success("File uploaded successfully");
        fetchUserImages();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload file");
    } finally {
      setUploadingFile(null);
    }
  };

  const handleDeleteImage = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      setDeletingId(fileId);
      const response = await deleteFile(fileId);

      if (response.data?.success) {
        message.success("File deleted successfully");
        setFiles(files.filter((file) => file["file-id"] !== fileId));
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      message.error("Failed to delete file");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col>
          <Title level={2}>My Files</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={handleFileSelect}
            icon={<FiUpload />}
            loading={uploadingFile}
          >
            Upload New File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileUpload}
          />
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <Text style={{ display: "block", marginTop: "16px" }}>
            Loading files...
          </Text>
        </div>
      ) : files.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {files.map((file) => (
            <div
              key={file["file-id"] || file.id || file.source}
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s",
                ":hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <img
                src={file.source}
                alt="Uploaded file"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  console.error("Error loading image:", file.source);
                  e.target.src = "https://via.placeholder.com/200";
                }}
              />
              <div
                style={{
                  padding: "12px",
                  background: "#fff",
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <Text ellipsis style={{ display: "block" }}>
                  {file.source.split("/").pop()}
                </Text>
              </div>
              <Button
                danger
                type="text"
                icon={
                  deletingId === file["file-id"] ? (
                    <FiLoader className="spin" />
                  ) : (
                    <FiTrash2 />
                  )
                }
                onClick={() => handleDeleteImage(file["file-id"])}
                disabled={deletingId === file["file-id"]}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "rgba(255, 255, 255, 0.8)",
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            border: "1px dashed #d9d9d9",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        >
          <FiImage
            style={{ fontSize: "48px", color: "#bfbfbf", marginBottom: "16px" }}
          />
          <Text type="secondary" style={{ display: "block" }}>
            No files found. Upload your first file!
          </Text>
        </div>
      )}
    </div>
  );
};

export default FileManagerPage;
