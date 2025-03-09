import React, { useState, useEffect } from "react";
import Head from "next/head";
import styled from "@emotion/styled";
import { v1 as uuidv1, v4 as uuidv4, v5 as uuidv5, validate } from "uuid";
import clipboardCopy from "clipboard-copy";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 40px;
  font-size: 1.2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const OptionGroup = styled.div`
  margin-bottom: 20px;
`;

const OptionLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  font-size: 16px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
  font-family: "Monaco", "Consolas", monospace;
  min-height: 300px;
  line-height: 1.5;
  resize: vertical;
  background-color: #f5f5f5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 25px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #ff9c00;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e68900;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  svg {
    margin-right: 8px;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  border: 2px solid #ff9c00;
  color: #ff9c00;

  &:hover {
    background-color: rgba(255, 156, 0, 0.1);
  }

  &:disabled {
    border-color: #ccc;
    color: #ccc;
    background-color: transparent;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 30px;
`;

const ResultsLabel = styled.div`
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NamespaceInput = styled.div`
  margin-top: 15px;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 5px;
`;

interface GuidOptions {
  version: string;
  count: number;
  format: string;
  uppercase: boolean;
  namespace: string;
  name: string;
}

// UUID namespaces defined in RFC4122
const PREDEFINED_NAMESPACES = {
  DNS: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  URL: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
  OID: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
  X500: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
};

const GuidGeneratorPage: React.FC = () => {
  const [guids, setGuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [countError, setCountError] = useState<string>("");
  const [options, setOptions] = useState<GuidOptions>({
    version: "v4", // Default to version 4 (random)
    count: 5,
    format: "dashed",
    uppercase: false,
    namespace: PREDEFINED_NAMESPACES.URL,
    name: "doodletechlabs.com",
  });
  const [namespaceError, setNamespaceError] = useState<string>("");

  // Generate GUIDs on component mount
  useEffect(() => {
    generateGuids();
  }, []);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    // Reset namespace error when changing options
    if (name === "namespace") {
      setNamespaceError("");
    }

    if (name === "count") {
      setCountError("");

      // Validate count is a positive number
      const countValue = parseInt(value, 10);
      if (isNaN(countValue) || countValue <= 0) {
        setCountError("Please enter a positive number");
        return;
      }

      // Prevent generating too many GUIDs (limit to 1000)
      if (countValue > 1000) {
        setCountError("Maximum of 1000 GUIDs allowed");
        return;
      }
    }

    setOptions((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "count" ? parseInt(value, 10) : value,
    }));
  };

  const formatGuid = (guid: string): string => {
    let formatted = guid;

    // Remove dashes if needed
    if (options.format === "nodashes") {
      formatted = formatted.replace(/-/g, "");
    } else if (options.format === "braces") {
      formatted = `{${formatted}}`;
    } else if (options.format === "parentheses") {
      formatted = `(${formatted})`;
    }

    // Convert to uppercase if needed
    if (options.uppercase) {
      formatted = formatted.toUpperCase();
    }

    return formatted;
  };

  const generateGuids = () => {
    try {
      // Don't proceed if there are errors
      if (countError || namespaceError) {
        return;
      }

      // Validate namespace if using v5
      if (options.version === "v5" && !validate(options.namespace)) {
        setNamespaceError("Please enter a valid UUID for the namespace");
        return;
      }

      const newGuids: string[] = [];

      for (let i = 0; i < options.count; i++) {
        let guid: string;

        switch (options.version) {
          case "v1":
            guid = uuidv1();
            break;
          case "v5":
            guid = uuidv5(options.name, options.namespace);
            break;
          case "v4":
          default:
            guid = uuidv4();
            break;
        }

        newGuids.push(formatGuid(guid));
      }

      setGuids(newGuids);
      setNamespaceError("");
    } catch (error) {
      console.error("Error generating GUIDs:", error);
      if (error instanceof Error) {
        setNamespaceError(error.message);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    clipboardCopy(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const copyAllToClipboard = () => {
    const allGuids = guids.join("\n");
    copyToClipboard(allGuids);
  };

  const getNamespaceOptions = () => {
    if (options.version !== "v5") return null;

    return (
      <>
        <OptionGroup>
          <OptionLabel htmlFor="namespace">Namespace (UUID v5)</OptionLabel>
          <Select id="namespace" name="namespace" value={options.namespace} onChange={handleOptionChange}>
            <option value={PREDEFINED_NAMESPACES.URL}>URL Namespace</option>
            <option value={PREDEFINED_NAMESPACES.DNS}>DNS Namespace</option>
            <option value={PREDEFINED_NAMESPACES.OID}>OID Namespace</option>
            <option value={PREDEFINED_NAMESPACES.X500}>X500 Namespace</option>
            <option value="custom">Custom Namespace</option>
          </Select>

          {options.namespace === "custom" && (
            <NamespaceInput>
              <Input
                type="text"
                name="namespace"
                placeholder="Enter custom namespace UUID"
                onChange={handleOptionChange}
              />
              {namespaceError && <ErrorMessage>{namespaceError}</ErrorMessage>}
            </NamespaceInput>
          )}
        </OptionGroup>

        <OptionGroup>
          <OptionLabel htmlFor="name">Name (for UUID v5)</OptionLabel>
          <Input
            type="text"
            id="name"
            name="name"
            value={options.name}
            onChange={handleOptionChange}
            placeholder="Enter a name"
          />
        </OptionGroup>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>GUID Generator - DoodleTechLabs</title>
        <meta
          name="description"
          content="Generate random GUIDs/UUIDs quickly and easily with our free online tool. Create multiple IDs at once with custom formatting options."
        />
        <meta name="keywords" content="GUID generator, UUID generator, random ID, unique identifier, RFC4122" />
      </Head>

      <Container>
        <PageTitle>GUID Generator</PageTitle>
        <Subtitle>Generate random GUIDs/UUIDs for your projects with ease</Subtitle>

        <Card>
          <OptionsGrid>
            <OptionGroup>
              <OptionLabel htmlFor="version">UUID Version</OptionLabel>
              <Select id="version" name="version" value={options.version} onChange={handleOptionChange}>
                <option value="v4">Version 4 (Random)</option>
                <option value="v1">Version 1 (Time-based)</option>
                <option value="v5">Version 5 (Name-based)</option>
              </Select>
            </OptionGroup>

            <OptionGroup>
              <OptionLabel htmlFor="count">Number of GUIDs</OptionLabel>
              <Input
                type="number"
                id="count"
                name="count"
                value={options.count}
                onChange={handleOptionChange}
                min="1"
                max="1000"
                placeholder="Number of GUIDs (1-1000)"
              />
              {countError && <ErrorMessage>{countError}</ErrorMessage>}
            </OptionGroup>

            <OptionGroup>
              <OptionLabel htmlFor="format">Format</OptionLabel>
              <Select id="format" name="format" value={options.format} onChange={handleOptionChange}>
                <option value="dashed">Dashed (xxxxxxxx-xxxx...)</option>
                <option value="nodashes">No Dashes (xxxxxxxxxxxxxxx...)</option>
                <option value="braces">Braces {`{xxxxxxxx-xxxx...}`}</option>
                <option value="parentheses">Parentheses (xxxxxxxx-xxxx...)</option>
              </Select>
            </OptionGroup>

            <OptionGroup>
              <OptionLabel htmlFor="uppercase">
                <input
                  type="checkbox"
                  id="uppercase"
                  name="uppercase"
                  checked={options.uppercase}
                  onChange={handleOptionChange}
                  style={{ marginRight: "8px" }}
                />
                Uppercase
              </OptionLabel>
            </OptionGroup>
          </OptionsGrid>

          {getNamespaceOptions()}

          <ButtonGroup>
            <Button onClick={generateGuids}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M12 3v3m0 4.5V12m0 4.5V18m-4.5-7.5h9"></path>
              </svg>
              Generate GUIDs
            </Button>
            <SecondaryButton onClick={copyAllToClipboard} disabled={guids.length === 0}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              {copied ? "Copied!" : "Copy All"}
            </SecondaryButton>
          </ButtonGroup>
        </Card>

        <ResultsContainer>
          <ResultsLabel>
            <span>Generated GUIDs ({guids.length})</span>
            <span className="text-sm text-gray-500">
              {options.version === "v5" ? "Name-based UUIDs will be identical for the same input" : ""}
            </span>
          </ResultsLabel>
          <TextArea readOnly value={guids.join("\n")} onClick={(e) => (e.target as HTMLTextAreaElement).select()} />
        </ResultsContainer>
      </Container>
    </>
  );
};

export default GuidGeneratorPage;
