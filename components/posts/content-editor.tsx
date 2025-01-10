"use client";

import { useRef, useEffect } from "react";
import { Textarea } from "../ui/textarea";

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export function ContentEditor({
  value,
  onChange,
  placeholder,
  maxLength,
}: ContentEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="min-h-[100px] resize-none overflow-hidden text-lg"
      rows={1}
    />
  );
}
