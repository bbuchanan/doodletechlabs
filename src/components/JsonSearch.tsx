import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { searchJSON, extractNodesByPath } from "../utils/jsonUtils";
import clipboardCopy from "clipboard-copy";

interface JsonSearchProps {
  jsonData: object | null;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 16px;
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

const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 200px;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 4px;
  color: #333;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #0078d4;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const Checkbox = styled.input`
  margin-right: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #0078d4;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  align-self: flex-end;

  &:hover {
    background-color: #106ebe;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  padding: 16px;
  max-height: 300px;
  overflow: auto;
`;

const NoResults = styled.div`
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 16px;
`;

const SearchResultList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SearchResultItem = styled.li`
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Path = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
  color: #0078d4;
`;

const Value = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  background-color: #f9f9f9;
  padding: 8px;
  border-radius: 4px;
  max-height: 150px;
  overflow: auto;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

interface SearchResult {
  path: string;
  value: any;
}

const JsonSearch: React.FC<JsonSearchProps> = ({ jsonData }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [extractPath, setExtractPath] = useState<string>("");
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [extractedNode, setExtractedNode] = useState<any>(null);
  const [showExtracted, setShowExtracted] = useState<boolean>(false);

  useEffect(() => {
    // Clear results when JSON data changes
    setSearchResults([]);
    setExtractedNode(null);
    setShowExtracted(false);
  }, [jsonData]);

  const handleSearch = () => {
    if (!jsonData || !searchTerm.trim()) return;

    const paths = searchJSON(jsonData, searchTerm, caseSensitive);
    const results: SearchResult[] = paths.map((path) => ({
      path,
      value: extractNodesByPath(jsonData, path),
    }));

    setSearchResults(results);
    setShowExtracted(false);
  };

  const handleExtract = () => {
    if (!jsonData || !extractPath.trim()) return;

    const extracted = extractNodesByPath(jsonData, extractPath);
    setExtractedNode(extracted);
    setShowExtracted(true);
  };

  const handleCopyPath = (path: string) => {
    clipboardCopy(path)
      .then(() => {
        alert(`Path "${path}" copied to clipboard!`);
      })
      .catch((err) => {
        console.error("Failed to copy path:", err);
      });
  };

  const handleCopyValue = (value: any) => {
    try {
      const stringValue = typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);

      clipboardCopy(stringValue)
        .then(() => {
          alert("Value copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy value:", err);
        });
    } catch (err) {
      console.error("Error stringifying value:", err);
    }
  };

  const handleExtractFromResult = (path: string) => {
    setExtractPath(path);

    if (jsonData) {
      const extracted = extractNodesByPath(jsonData, path);
      setExtractedNode(extracted);
      setShowExtracted(true);
    }
  };

  // Helper to render the value depending on its type
  const renderValue = (value: any) => {
    if (value === undefined) {
      return <Value style={{ color: "#999" }}>undefined</Value>;
    }

    if (value === null) {
      return <Value style={{ color: "#999" }}>null</Value>;
    }

    if (typeof value === "object") {
      return <Value>{JSON.stringify(value, null, 2)}</Value>;
    }

    if (typeof value === "string") {
      return <Value style={{ color: "#008000" }}>{`"${value}"`}</Value>;
    }

    if (typeof value === "number") {
      return <Value style={{ color: "#0000ff" }}>{value}</Value>;
    }

    if (typeof value === "boolean") {
      return <Value style={{ color: "#800080" }}>{String(value)}</Value>;
    }

    return <Value>{String(value)}</Value>;
  };

  return (
    <Container>
      <Header>
        <Title>Search & Extract</Title>
      </Header>

      <SearchContainer>
        <InputGroup>
          <Label>Search Term</Label>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter search term"
            disabled={!jsonData}
          />
          <CheckboxGroup>
            <Checkbox
              type="checkbox"
              id="caseSensitive"
              checked={caseSensitive}
              onChange={() => setCaseSensitive(!caseSensitive)}
              disabled={!jsonData}
            />
            <Label htmlFor="caseSensitive">Case sensitive</Label>
          </CheckboxGroup>
        </InputGroup>

        <Button onClick={handleSearch} disabled={!jsonData || !searchTerm.trim()}>
          Search
        </Button>
      </SearchContainer>

      <SearchContainer>
        <InputGroup>
          <Label>Extract Path</Label>
          <Input
            type="text"
            value={extractPath}
            onChange={(e) => setExtractPath(e.target.value)}
            placeholder="E.g., user.address.street"
            disabled={!jsonData}
          />
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Use dot notation for nested properties. For arrays, use: items[0]
          </div>
        </InputGroup>

        <Button onClick={handleExtract} disabled={!jsonData || !extractPath.trim()}>
          Extract
        </Button>
      </SearchContainer>

      <ResultsContainer>
        {!jsonData ? (
          <NoResults>No JSON data to search</NoResults>
        ) : showExtracted ? (
          <>
            <Path>Extracted from: {extractPath}</Path>
            {extractedNode !== undefined ? (
              <>
                {renderValue(extractedNode)}
                <ActionsContainer>
                  <ActionButton onClick={() => handleCopyValue(extractedNode)}>Copy Value</ActionButton>
                  <ActionButton onClick={() => setShowExtracted(false)}>Back to Results</ActionButton>
                </ActionsContainer>
              </>
            ) : (
              <NoResults>Path not found in JSON</NoResults>
            )}
          </>
        ) : searchResults.length > 0 ? (
          <SearchResultList>
            {searchResults.map((result, index) => (
              <SearchResultItem key={index}>
                <Path>{result.path}</Path>
                {renderValue(result.value)}
                <ActionsContainer>
                  <ActionButton onClick={() => handleCopyPath(result.path)}>Copy Path</ActionButton>
                  <ActionButton onClick={() => handleCopyValue(result.value)}>Copy Value</ActionButton>
                  <ActionButton onClick={() => handleExtractFromResult(result.path)}>Extract</ActionButton>
                </ActionsContainer>
              </SearchResultItem>
            ))}
          </SearchResultList>
        ) : searchTerm ? (
          <NoResults>No results found</NoResults>
        ) : (
          <NoResults>Enter a search term and click Search</NoResults>
        )}
      </ResultsContainer>
    </Container>
  );
};

export default JsonSearch;
