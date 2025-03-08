import React, { useState } from "react";
import { JSONTree } from "react-json-tree";
import styled from "@emotion/styled";
import clipboardCopy from "clipboard-copy";

interface JsonViewerProps {
  jsonData: object | null;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 40vh;
  overflow: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const TreeContainer = styled.div`
  padding: 16px;
  flex-grow: 1;
  overflow: auto;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 16px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #0078d4;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #106ebe;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// Theme for the JSON tree view
const theme = {
  scheme: "monokai",
  author: "wimer hazenberg (http://www.monokai.nl)",
  base00: "#272822",
  base01: "#383830",
  base02: "#49483e",
  base03: "#75715e",
  base04: "#a59f85",
  base05: "#f8f8f2",
  base06: "#f5f4f1",
  base07: "#f9f8f5",
  base08: "#f92672",
  base09: "#fd971f",
  base0A: "#f4bf75",
  base0B: "#a6e22e",
  base0C: "#a1efe4",
  base0D: "#66d9ef",
  base0E: "#ae81ff",
  base0F: "#cc6633",
};

const JsonViewer: React.FC<JsonViewerProps> = ({ jsonData }) => {
  const [expandedPaths, setExpandedPaths] = useState<string[]>([]);
  const [expandAll, setExpandAll] = useState<boolean>(false);

  const handleCopyToClipboard = () => {
    if (jsonData) {
      const jsonString = JSON.stringify(jsonData, null, 2);
      clipboardCopy(jsonString)
        .then(() => {
          alert("JSON copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
          alert("Failed to copy to clipboard");
        });
    }
  };

  const handleDownload = () => {
    if (jsonData) {
      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "data.json";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
  };

  return (
    <Container>
      <Header>
        <Title>JSON Viewer</Title>
        <ButtonsContainer>
          <Button onClick={toggleExpandAll} disabled={!jsonData}>
            {expandAll ? "Collapse All" : "Expand All"}
          </Button>
          <Button onClick={handleCopyToClipboard} disabled={!jsonData}>
            Copy to Clipboard
          </Button>
          <Button onClick={handleDownload} disabled={!jsonData}>
            Download JSON
          </Button>
        </ButtonsContainer>
      </Header>
      <TreeContainer>
        {jsonData ? (
          <JSONTree data={jsonData} theme={theme} invertTheme={true} shouldExpandNodeInitially={() => expandAll} />
        ) : (
          <EmptyState>No valid JSON to display. Paste some JSON in the input above.</EmptyState>
        )}
      </TreeContainer>
    </Container>
  );
};

export default JsonViewer;
