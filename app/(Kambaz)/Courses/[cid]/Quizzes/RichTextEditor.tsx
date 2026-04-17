"use client";
import DefaultEditor from "react-simple-wysiwyg";

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <DefaultEditor
      value={value || ""}
      onChange={(e: any) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
