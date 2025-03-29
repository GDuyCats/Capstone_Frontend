import React, { useEffect } from "react";
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
import { Extension } from "@tiptap/core";
import "../TipTapEditor.css";

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

const MenuBar = () => {
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
];

const TipTapEditor = ({ content, setContent }) => {
  return (
    <div className="tiptap-editor-container">
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
        onUpdate={({ editor }) => {
          const newContent = editor.getHTML();
          setContent(newContent);
        }}
      >
        <EditorContent />
      </EditorProvider>
    </div>
  );
};

export default TipTapEditor;
