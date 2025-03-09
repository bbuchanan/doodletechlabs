import React from "react";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "500px",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      Loading editor...
    </div>
  ),
});

interface MonacoEditorWrapperProps {
  height: string;
  defaultLanguage: string;
  defaultValue: string;
  onChange: (value: string | undefined) => void;
  options?: Record<string, any>;
}

const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({
  height,
  defaultLanguage,
  defaultValue,
  onChange,
  options,
}) => {
  return (
    <MonacoEditor
      height={height}
      defaultLanguage={defaultLanguage}
      defaultValue={defaultValue}
      onChange={onChange}
      options={options || {}}
    />
  );
};

export default MonacoEditorWrapper;
