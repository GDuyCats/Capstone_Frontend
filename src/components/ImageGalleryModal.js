import React, { useEffect, useState, useRef } from "react";
import { uploadFile, getUserFiles, deleteFile } from "../api/apiClient";
import { FiUpload, FiX, FiImage, FiLoader, FiTrash2 } from "react-icons/fi";

const ImageGalleryModal = ({ isOpen, onClose, onSelectImage }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchUserImages();
    }
  }, [isOpen]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };
  const handleDeleteImage = async (fileId, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan ra phần tử cha
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      setDeletingId(fileId);
      const response = await deleteFile(fileId);

      if (response.data?.success) {
        setFiles(files.filter((file) => file["file-id"] !== fileId));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingFile(file);
      const response = await uploadFile(file);

      if (response.data?.success) {
        fetchUserImages();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingFile(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="image-gallery-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <h3>
          <FiImage style={{ verticalAlign: "middle", marginRight: "10px" }} />
          Image Gallery
        </h3>

        <div className="upload-section">
          <button onClick={handleFileSelect}>
            <FiUpload style={{ verticalAlign: "middle" }} /> Upload Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileUpload}
          />
          {uploadingFile && (
            <p>
              <FiLoader className="spin" /> Uploading: {uploadingFile.name}...
            </p>
          )}
        </div>

        <div className="images-grid">
          {loading ? (
            <div className="loading-text">
              <FiLoader className="spin" /> Loading images...
            </div>
          ) : files.length > 0 ? (
            files.map((file) => (
              <div
                key={file["file-id"] || file.id || file.source}
                className="image-item"
                onClick={() => onSelectImage(file.source)}
              >
                <img
                  src={file.source}
                  alt="User uploaded"
                  onError={(e) => {
                    console.error("Error loading image:", file.source);
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <button
                  className="delete-button"
                  onClick={(e) => handleDeleteImage(file["file-id"], e)}
                  disabled={deletingId === file["file-id"]}
                >
                  {deletingId === file["file-id"] ? (
                    <FiLoader className="spin" />
                  ) : (
                    <FiTrash2 />
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <FiImage />
              <p>No images found. Upload some images first.</p>
            </div>
          )}
        </div>

        <button className="close-button" onClick={onClose}>
          <FiX style={{ verticalAlign: "middle", marginRight: "5px" }} /> Close
        </button>
      </div>
    </div>
  );
};

export default ImageGalleryModal;
