import React, { useState, useRef } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import styled from "@emotion/styled";
import { validateJSON, JsonValidationResult } from "../utils/jsonUtils";
import * as monaco from "monaco-editor";

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

const ErrorDetails = styled.div`
  padding: 8px 16px;
  background-color: #fff3f3;
  border-bottom: 1px solid #ffcdd2;
  font-size: 14px;
  color: #d32f2f;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ErrorMessage = styled.span`
  font-family: monospace;
`;

const ErrorLocation = styled.span`
  font-family: monospace;
  color: #666;
`;

const JumpToErrorButton = styled.button`
  padding: 4px 8px;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #b71c1c;
  }
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
  const [validationResult, setValidationResult] = useState<JsonValidationResult>({ isValid: true });
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleJsonChange = (value: string | undefined) => {
    const text = value || "";
    setJsonText(text);

    // Only validate if there's some text
    if (text.trim()) {
      const result = validateJSON(text);
      setValidationResult(result);

      if (result.isValid) {
        onJsonUpdate(JSON.parse(text));
      } else {
        onJsonUpdate(null);
      }
    } else {
      setValidationResult({ isValid: true });
      onJsonUpdate(null);
    }
  };

  const handleFormat = () => {
    if (validationResult.isValid && jsonText.trim()) {
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
    setValidationResult({ isValid: true });
    onJsonUpdate(null);
  };

  const jumpToError = () => {
    if (
      editorRef.current &&
      validationResult.error &&
      validationResult.error.line !== undefined &&
      validationResult.error.column !== undefined
    ) {
      const line = validationResult.error.line;
      const column = validationResult.error.column;

      // Position the cursor at the error location
      editorRef.current.revealPositionInCenter({
        lineNumber: line,
        column: column,
      });

      editorRef.current.setPosition({
        lineNumber: line,
        column: column,
      });

      // Focus the editor
      editorRef.current.focus();

      // Add a temporary decoration to highlight the error
      const decorations = editorRef.current.createDecorationsCollection([
        {
          range: new monaco.Range(line, column, line, column + 1),
          options: {
            className: "errorHighlight",
            glyphMarginClassName: "errorGlyphMargin",
            isWholeLine: false,
            inlineClassName: "errorInline",
            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          },
        },
      ]);

      // Remove the decoration after a few seconds
      setTimeout(() => {
        decorations.clear();
      }, 3000);
    }
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
    setValidationResult({ isValid: true });
    onJsonUpdate(JSON.parse(sampleJson));
  };

  // Simple intentionally broken JSON to demonstrate error handling
  const loadBrokenJson = () => {
    const brokenJson = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "phoneNumbers": [
    {
      "type": "home"
      "number": "212-555-1234"
    },
    {
      "type": "work",
      "number": "646-555-5678"
    }
  ],
  "tags": ["developer", "javascript", "react"]
}`;

    setJsonText(brokenJson);
    // Let the handleJsonChange detect the error through the editor's onChange event
  };

  return (
    <Container>
      <Header>
        <Title>JSON Input</Title>
        <StatusContainer isValid={validationResult.isValid}>
          {jsonText.trim() ? (validationResult.isValid ? "Valid JSON" : "Invalid JSON") : "Paste your JSON here"}
        </StatusContainer>
        <ButtonsContainer>
          <Button onClick={loadSampleJson}>Load Sample</Button>
          <Button onClick={loadBrokenJson}>Test Error</Button>
          <Button onClick={handleFormat} disabled={!validationResult.isValid || !jsonText.trim()}>
            Format
          </Button>
          <Button onClick={handleClear} disabled={!jsonText.trim()}>
            Clear
          </Button>
        </ButtonsContainer>
      </Header>

      {!validationResult.isValid && validationResult.error && (
        <ErrorDetails>
          <div>
            <ErrorMessage>{validationResult.error.message}</ErrorMessage>
            {validationResult.error.line && (
              <ErrorLocation>
                {" "}
                at line {validationResult.error.line}, column {validationResult.error.column}
              </ErrorLocation>
            )}
          </div>
          {validationResult.error.line && <JumpToErrorButton onClick={jumpToError}>Jump to Error</JumpToErrorButton>}
        </ErrorDetails>
      )}

      <Editor
        height="100%"
        defaultLanguage="json"
        value={jsonText}
        onChange={handleJsonChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          lineNumbers: "on",
          glyphMargin: true,
        }}
      />
    </Container>
  );
};

export default JsonInput;
