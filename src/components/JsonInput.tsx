import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import styled from "@emotion/styled";
import { isValidJSON } from "../utils/jsonUtils";

interface JsonInputProps {
  onJsonUpdate: (jsonData: object | null) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 40vh;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const StatusContainer = styled.div<{ isValid: boolean }>`
  display: flex;
  align-items: center;
  color: ${(props) => (props.isValid ? "green" : "red")};
  font-size: 14px;
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

const JsonInput: React.FC<JsonInputProps> = ({ onJsonUpdate }) => {
  const [jsonText, setJsonText] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleJsonChange = (value: string | undefined) => {
    const text = value || "";
    setJsonText(text);

    // Only validate if there's some text
    if (text.trim()) {
      const valid = isValidJSON(text);
      setIsValid(valid);

      if (valid) {
        onJsonUpdate(JSON.parse(text));
      } else {
        onJsonUpdate(null);
      }
    } else {
      setIsValid(true);
      onJsonUpdate(null);
    }
  };

  const handleFormat = () => {
    if (isValid && jsonText.trim()) {
      try {
        const formatted = JSON.stringify(JSON.parse(jsonText), null, 2);
        setJsonText(formatted);
      } catch (e) {
        console.error("Error formatting JSON:", e);
      }
    }
  };

  const handleClear = () => {
    setJsonText("");
    setIsValid(true);
    onJsonUpdate(null);
  };

  // Sample JSON example to load
  const loadSampleJson = () => {
    const sampleJson = JSON.stringify(
      {
        name: "John Doe",
        age: 30,
        isActive: true,
        address: {
          street: "123 Main St",
          city: "New York",
          zipCode: "10001",
        },
        phoneNumbers: [
          {
            type: "home",
            number: "212-555-1234",
          },
          {
            type: "work",
            number: "646-555-5678",
          },
        ],
        tags: ["developer", "javascript", "react"],
      },
      null,
      2
    );

    setJsonText(sampleJson);
    setIsValid(true);
    onJsonUpdate(JSON.parse(sampleJson));
  };

  return (
    <Container>
      <Header>
        <Title>JSON Input</Title>
        <StatusContainer isValid={isValid}>
          {jsonText.trim() ? (isValid ? "Valid JSON" : "Invalid JSON") : "Paste your JSON here"}
        </StatusContainer>
        <ButtonsContainer>
          <Button onClick={loadSampleJson}>Load Sample</Button>
          <Button onClick={handleFormat} disabled={!isValid || !jsonText.trim()}>
            Format
          </Button>
          <Button onClick={handleClear} disabled={!jsonText.trim()}>
            Clear
          </Button>
        </ButtonsContainer>
      </Header>
      <Editor
        height="100%"
        defaultLanguage="json"
        value={jsonText}
        onChange={handleJsonChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
        }}
      />
    </Container>
  );
};

export default JsonInput;
