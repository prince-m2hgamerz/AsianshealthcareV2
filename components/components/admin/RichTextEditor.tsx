"use client";

import { useState, useRef, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Write your content here..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && isMounted) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isMounted]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const ToolbarButton = ({ command, arg, children }: { command: string; arg?: string; children: React.ReactNode }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); execCommand(command, arg); }}
      className="px-2.5 py-1.5 text-caption text-text-muted hover:bg-surface rounded transition-colors"
    >
      {children}
    </button>
  );

  if (!isMounted) {
    return (
      <div className="border border-border rounded-md min-h-[200px] p-4 text-body-md text-text-light">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-surface">
        <ToolbarButton command="bold"><strong>B</strong></ToolbarButton>
        <ToolbarButton command="italic"><em>I</em></ToolbarButton>
        <ToolbarButton command="underline"><u>U</u></ToolbarButton>
        <span className="w-px h-5 bg-border mx-1" />
        <ToolbarButton command="formatBlock" arg="h3">H3</ToolbarButton>
        <ToolbarButton command="formatBlock" arg="p">P</ToolbarButton>
        <span className="w-px h-5 bg-border mx-1" />
        <ToolbarButton command="insertUnorderedList">UL</ToolbarButton>
        <ToolbarButton command="insertOrderedList">OL</ToolbarButton>
        <span className="w-px h-5 bg-border mx-1" />
        <ToolbarButton command="createLink" arg="https://">Link</ToolbarButton>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[250px] p-4 text-body-md text-text focus:outline-none [&:empty:before]:text-text-light [&:empty:before]:content-[attr(data-placeholder)]"
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}
