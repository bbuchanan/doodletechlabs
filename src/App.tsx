import React, { useState } from "react";
import styled from "@emotion/styled";
import JsonInput from "./components/JsonInput";
import JsonViewer from "./components/JsonViewer";
import JsonSearch from "./components/JsonSearch";
import "./App.css";

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  color: #0078d4;
  margin-bottom: 8px;
`;

const Description = styled.p`
  color: #666;
  font-size: 16px;
  max-width: 800px;
  margin: 0 auto;
`;

function App() {
  const [jsonData, setJsonData] = useState<object | null>(null);

  const handleJsonUpdate = (data: object | null) => {
    setJsonData(data);
  };

  return (
    <AppContainer>
      <Header>
        <Title>JSON Editor & Formatter</Title>
        <Description>
          Paste your JSON below, format it, and explore the structure. You can expand/collapse nodes, search for
          specific values, and extract data.
        </Description>
      </Header>

      <JsonInput onJsonUpdate={handleJsonUpdate} />
      <JsonViewer jsonData={jsonData} />
      <JsonSearch jsonData={jsonData} />
    </AppContainer>
  );
}

export default App;
