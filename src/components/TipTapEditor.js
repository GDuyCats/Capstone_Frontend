import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { EditorProvider, useCurrentEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import { Extension } from "@tiptap/core";
import "../TipTapEditor.css";
import { uploadFile, getUserFiles } from "../api/apiClient";
import ImageGalleryModal from "./ImageGalleryModal";

// Font Size Extension
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace("px", ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}px` };
            },
          },
        },
      },
    ];
  },
});

// Image Upload Modal Component
const ImageUploadModal = ({ isOpen, onClose, onImageSelect }) => {
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch user's images
  useEffect(() => {
    if (isOpen) {
      fetchUserImages();
    }
  }, [isOpen, page]);

  const fetchUserImages = async () => {
    try {
      setLoading(true);
      // Get user ID from localStorage
      const auth = JSON.parse(localStorage.getItem("auth"));
      if (!auth?.id) return;

      const response = await getUserFiles(auth.id, page);
      if (response.data.success) {
        setFiles(response.data.data["list-data"]);
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingFile(file);
      const response = await uploadFile(file);

      if (response.data.success) {
        fetchUserImages(); // Refresh the images list
        setUploadingFile(null);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadingFile(null);
    }
  };

  const handleImageClick = (image) => {
    onImageSelect(image.source);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="image-upload-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <h3>Insert Image</h3>
        <div className="upload-section">
          <button onClick={handleFileSelect}>Upload New Image</button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileUpload}
          />
          {uploadingFile && <p>Uploading: {uploadingFile.name}...</p>}
        </div>
        <div className="images-grid">
          {loading ? (
            <p>Loading images...</p>
          ) : (
            files.map((file) => (
              <div
                key={file["file-id"]}
                className="image-item"
                onClick={() => handleImageClick(file)}
              >
                <img src={file.source} alt="User uploaded" />
              </div>
            ))
          )}
        </div>
        <button className="close-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

// Extended MenuBar with Image Button
const MenuBar = ({ openImageModal }) => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <div className="menu-bar">
      <button onClick={() => editor.chain().focus().undo().run()}>
        ↺ Undo
      </button>
      <button onClick={() => editor.chain().focus().redo().run()}>
        ↻ Redo
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      >
        U
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        S
      </button>

      {[1, 2, 3, 4, 5].map((level) => (
        <button
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          className={editor.isActive("heading", { level }) ? "is-active" : ""}
        >
          H{level}
        </button>
      ))}

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        1. List
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        Quote
      </button>
      <button onClick={openImageModal} className="image-button">
        📷 Image
      </button>
      <input
        type="color"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        style={{
          width: "30px",
          height: "30px",
          border: "none",
          cursor: "pointer",
        }}
      />

      <select
        onChange={(e) => {
          const size = e.target.value;
          editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
        }}
        defaultValue="16"
      >
        {[12, 14, 16, 18, 20, 24, 30].map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select>
    </div>
  );
};

// Include Image in extensions
const extensions = [
  StarterKit.configure({
    heading: false,
    bulletList: false,
    orderedList: false,
  }),
  Bold,
  Italic,
  Underline,
  FontSize,
  Strike,
  Heading.configure({ levels: [1, 2, 3, 4, 5] }),
  BulletList,
  OrderedList,
  ListItem,
  Blockquote,
  CodeBlock,
  TextStyle,
  Color,
  Image,
];

const TipTapEditor = ({ content, setContent }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const editorRef = useRef(null);

  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

  const handleImageSelect = (src) => {
    if (editorRef.current) {
      editorRef.current.chain().focus().setImage({ src }).run();
    }
  };

  const handlePaste = (view, event) => {
    if (event.clipboardData?.files?.length) {
      event.preventDefault();
      const file = event.clipboardData.files[0];
      if (file.type.startsWith("image/")) {
        uploadFile(file)
          .then((response) => {
            if (response.data?.success) {
              const imageUrl = response.data.data[0]?.source;
              if (imageUrl) {
                view.dispatch(
                  view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.image.create({
                      src: imageUrl,
                      alt: "Pasted image",
                    })
                  )
                );
              }
            }
          })
          .catch((error) => {
            console.error("Error uploading pasted image:", error);
          });
      }
    }
  };
  return (
    <div className="tiptap-editor-container">
      <EditorProvider
        slotBefore={<MenuBar openImageModal={openImageModal} />}
        extensions={extensions}
        content={content}
        onUpdate={({ editor }) => {
          const newContent = editor.getHTML();
          setContent(newContent);
        }}
        onCreate={({ editor }) => {
          editorRef.current = editor;
        }}
        editorProps={{
          handlePaste: handlePaste,
        }}
      >
        <EditorContent />
      </EditorProvider>

      <ImageGalleryModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        onSelectImage={handleImageSelect}
      />
    </div>
  );
};

export default TipTapEditor;
