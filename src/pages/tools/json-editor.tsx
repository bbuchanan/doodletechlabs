import React, { useState } from "react";
import Head from "next/head";
import styled from "@emotion/styled";
import dynamic from "next/dynamic";

// Dynamically import the components to avoid SSR issues with browser-specific dependencies
const JsonInput = dynamic(() => import("../../components/JsonInput"), { ssr: false });
const JsonViewer = dynamic(() => import("../../components/JsonViewer"), { ssr: false });
const JsonSearch = dynamic(() => import("../../components/JsonSearch"), { ssr: false });

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
`;

const Subtitle = styled.p`
  color: #666;
  max-width: 800px;
  margin: 0 auto 30px;
  font-size: 1.1rem;
  line-height: 1.5;
`;

interface JsonData {
  [key: string]: any;
}

const JsonEditorPage: React.FC = () => {
  const [jsonData, setJsonData] = useState<JsonData | null>(null);

  const handleJsonUpdate = (data: JsonData | null): void => {
    setJsonData(data);
  };

  return (
    <>
      <Head>
        <title>JSON Editor and Formatter - DoodleTechLabs</title>
        <meta
          name="description"
          content="Free online JSON editor with syntax highlighting, validation, and formatting. View, edit, and explore your JSON data with an interactive tree view."
        />
        <meta name="keywords" content="JSON editor, JSON formatter, JSON validator, JSON viewer, online JSON tools" />
      </Head>

      <Container>
        <PageHeader>
          <PageTitle>JSON Editor & Formatter</PageTitle>
          <Subtitle>
            Paste your JSON below, format it, and explore the structure. You can expand/collapse nodes, search for
            specific values, and extract data. All processing happens in your browser - your data never leaves your
            computer.
          </Subtitle>
        </PageHeader>

        <JsonInput onJsonUpdate={handleJsonUpdate} />
        <JsonViewer jsonData={jsonData} />
        <JsonSearch jsonData={jsonData} />
      </Container>
    </>
  );
};

export default JsonEditorPage;
