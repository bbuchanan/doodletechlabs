import React, { useState, useEffect } from "react";
import Head from "next/head";
import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { useLoading } from "../../components/layout/LoadingContext";

// Dynamically import the components with loading placeholders
const JsonInput = dynamic(() => import("../../components/JsonInput"), {
  ssr: false,
  loading: () => <EditorPlaceholder>Loading JSON editor...</EditorPlaceholder>,
});

const JsonViewer = dynamic(() => import("../../components/JsonViewer"), {
  ssr: false,
  loading: () => <EditorPlaceholder>Loading JSON viewer...</EditorPlaceholder>,
});

const JsonSearch = dynamic(() => import("../../components/JsonSearch"), {
  ssr: false,
  loading: () => <EditorPlaceholder>Loading search tools...</EditorPlaceholder>,
});

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

const EditorPlaceholder = styled.div`
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 16px;
  text-align: center;
  color: #666;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
`;

interface JsonData {
  [key: string]: any;
}

const JsonEditorPage: React.FC = () => {
  const [jsonData, setJsonData] = useState<JsonData | null>(null);
  const { startLoading, stopLoading } = useLoading();

  // Handle page loading
  useEffect(() => {
    // Set loading state when the page first renders
    startLoading();

    // Listen for the window load event to detect when all resources are loaded
    const handleLoad = () => {
      // Add a small delay to ensure components have rendered
      setTimeout(() => {
        stopLoading();
      }, 500);
    };

    // Check if window is already loaded
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
      stopLoading();
    };
  }, [startLoading, stopLoading]);

  const handleJsonUpdate = (data: JsonData | null): void => {
    setJsonData(data);
  };

  return (
    <>
      <Head>
        <title>JSON Editor and Formatter - DoodleTechLabs</title>
        <meta
          name="description"
          content="Free online JSON editor with syntax highlighting, tree view, and formatting. Edit, validate, and beautify your JSON data easily."
        />
      </Head>

      <Container>
        <PageHeader>
          <PageTitle>JSON Editor</PageTitle>
          <Subtitle>
            A free, online JSON editor for formatting, validating, and exploring your JSON data. Edit JSON with syntax
            highlighting and get a real-time tree view.
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
