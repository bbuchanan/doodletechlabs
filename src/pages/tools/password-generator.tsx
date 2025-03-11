import React, { useState, useEffect, useCallback, useMemo } from "react";
import Head from "next/head";
import styled from "@emotion/styled";
import useToolLoad from "../../hooks/useToolLoad";
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

const PasswordDisplay = styled.div`
  font-family: "Monaco", "Consolas", monospace;
  font-size: 1.4rem;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 30px;
  text-align: center;
  letter-spacing: 1px;
  position: relative;
  min-height: 30px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #eee;
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px;

  &:hover {
    color: #ff9c00;
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const OptionGroup = styled.div`
  margin-bottom: 20px;
`;

const SliderContainer = styled.div`
  margin-bottom: 30px;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  span {
    font-weight: 500;
    color: #333;
  }
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
  border-radius: 5px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: #ff9c00;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #ff9c00;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-weight: 500;
  color: #333;
  cursor: pointer;

  input {
    margin-right: 10px;
    cursor: pointer;
  }
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

  svg {
    margin-right: 8px;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 30px;
`;

const ResultsLabel = styled.div`
  font-weight: 500;
  margin-bottom: 10px;
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
  min-height: 200px;
  line-height: 1.5;
  resize: vertical;
  background-color: #f5f5f5;
`;

const PasswordStrength = styled.div<{ strength: number }>`
  margin-top: 15px;
  margin-bottom: 30px;

  .strength-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-weight: 500;

    .label {
      color: #333;
    }

    .value {
      color: ${(props) => {
        if (props.strength < 25) return "#d32f2f";
        if (props.strength < 50) return "#f57c00";
        if (props.strength < 75) return "#fbc02d";
        return "#388e3c";
      }};
    }
  }

  .strength-bar {
    height: 8px;
    background-color: #eee;
    border-radius: 4px;
    overflow: hidden;

    .filled {
      height: 100%;
      width: ${(props) => `${props.strength}%`};
      background-color: ${(props) => {
        if (props.strength < 25) return "#d32f2f";
        if (props.strength < 50) return "#f57c00";
        if (props.strength < 75) return "#fbc02d";
        return "#388e3c";
      }};
      transition: width 0.3s ease;
    }
  }
`;

interface PasswordOptions {
  length: number;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  count: number;
}

const PasswordGeneratorPage: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [passwords, setPasswords] = useState<string[]>([]);
  const [strength, setStrength] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const { startLoad, completeLoad } = useToolLoad();

  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
    count: 5,
  });

  const charSets = useMemo(
    () => ({
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
      similar: "il1Lo0O",
      ambiguous: "{}[]()/\\'\"`~,;:.<>",
    }),
    [] // No dependencies, so it will only run once.
  );
  // Filter character sets based on options
  const getAvailableChars = useCallback(() => {
    let chars = "";

    if (options.includeLowercase) chars += charSets.lowercase;
    if (options.includeUppercase) chars += charSets.uppercase;
    if (options.includeNumbers) chars += charSets.numbers;
    if (options.includeSymbols) chars += charSets.symbols;

    if (options.excludeSimilar) {
      charSets.similar.split("").forEach((char) => {
        chars = chars.replace(new RegExp(char, "g"), "");
      });
    }

    if (options.excludeAmbiguous) {
      charSets.ambiguous.split("").forEach((char) => {
        chars = chars.replace(new RegExp("\\" + char, "g"), "");
      });
    }

    return chars;
  }, [options, charSets]);

  // Shuffle a string
  const shuffleString = useCallback((str: string): string => {
    const array = str.split("");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  }, []);

  // Generate a single random password
  const generatePassword = useCallback((): string => {
    const chars = getAvailableChars();
    if (!chars.length) return "Please select at least one character set";

    let password = "";
    const length = options.length;

    // Ensure we have at least one of each required character type
    if (options.includeLowercase) {
      password += charSets.lowercase.charAt(Math.floor(Math.random() * charSets.lowercase.length));
    }
    if (options.includeUppercase) {
      password += charSets.uppercase.charAt(Math.floor(Math.random() * charSets.uppercase.length));
    }
    if (options.includeNumbers) {
      password += charSets.numbers.charAt(Math.floor(Math.random() * charSets.numbers.length));
    }
    if (options.includeSymbols) {
      password += charSets.symbols.charAt(Math.floor(Math.random() * charSets.symbols.length));
    }

    // Fill the rest with random characters
    while (password.length < length) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    // Shuffle the password
    return shuffleString(password);
  }, [options, getAvailableChars, charSets, shuffleString]);

  // Calculate password strength (0-100)
  const calculateStrength = useCallback((password: string): number => {
    if (!password) return 0;

    let score = 0;

    // Length contribution (up to 40 points)
    score += Math.min(password.length * 2.5, 40);

    // Character variety contribution (up to 60 points)
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    score += hasLower ? 10 : 0;
    score += hasUpper ? 15 : 0;
    score += hasDigit ? 15 : 0;
    score += hasSymbol ? 20 : 0;

    // Bonus for good mix (if all character types present)
    if (hasLower && hasUpper && hasDigit && hasSymbol) {
      score = Math.min(score + 10, 100);
    }

    return score;
  }, []);

  // Generate multiple passwords
  const generatePasswords = useCallback(() => {
    startLoad();

    try {
      const newPassword = generatePassword();
      setPassword(newPassword);

      const newStrength = calculateStrength(newPassword);
      setStrength(newStrength);

      const newPasswords = [];
      for (let i = 0; i < options.count; i++) {
        newPasswords.push(generatePassword());
      }
      setPasswords(newPasswords);
    } catch (error) {
      console.error("Error generating passwords:", error);
    } finally {
      // Always stop loading, even if an error occurred
      completeLoad();
    }
  }, [startLoad, completeLoad, options.count, generatePassword, calculateStrength]);

  // Handle option changes
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setOptions((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "length" || name === "count" ? parseInt(value, 10) : value,
    }));
  };

  // Copy password to clipboard
  const copyToClipboard = (text: string) => {
    clipboardCopy(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  // Copy all passwords to clipboard
  const copyAllToClipboard = () => {
    const allPasswords = passwords.join("\n");
    copyToClipboard(allPasswords);
  };

  // Get strength description
  const getStrengthText = (strength: number): string => {
    if (strength < 25) return "Weak";
    if (strength < 50) return "Fair";
    if (strength < 75) return "Good";
    return "Strong";
  };

  // Generate a password on initial load
  useEffect(() => {
    // Use a short timeout to allow the page to render first
    const timer = setTimeout(() => {
      try {
        generatePasswords();
      } catch (error) {
        console.error("Error during initial password generation:", error);
        completeLoad(); // Ensure loading stops even on error
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      completeLoad(); // Ensure loading stops when component unmounts
    };
  }, [generatePasswords, completeLoad]);

  return (
    <>
      <Head>
        <title>Strong Password Generator - DoodleTechLabs</title>
        <meta
          name="description"
          content="Generate secure, random passwords with custom length and character options. Create strong passwords to enhance your online security."
        />
        <meta
          name="keywords"
          content="password generator, secure password, random password, password strength, online security"
        />
      </Head>

      <Container>
        <PageTitle>Strong Password Generator</PageTitle>
        <Subtitle>Create secure, random passwords for your accounts</Subtitle>

        <Card>
          <PasswordDisplay onClick={() => copyToClipboard(password)}>
            {password || "Generating..."}
            <CopyButton
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(password);
              }}
              title="Copy to clipboard">
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
            </CopyButton>
          </PasswordDisplay>

          <PasswordStrength strength={strength}>
            <div className="strength-label">
              <span className="label">Password Strength</span>
              <span className="value">{getStrengthText(strength)}</span>
            </div>
            <div className="strength-bar">
              <div className="filled"></div>
            </div>
          </PasswordStrength>

          <SliderContainer>
            <SliderLabel>
              <span>Password Length</span>
              <span>{options.length} characters</span>
            </SliderLabel>
            <Slider type="range" name="length" min="8" max="64" value={options.length} onChange={handleOptionChange} />
          </SliderContainer>

          <OptionsGrid>
            <OptionGroup>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  name="includeLowercase"
                  checked={options.includeLowercase}
                  onChange={handleOptionChange}
                />
                Include Lowercase
              </CheckboxContainer>

              <CheckboxContainer>
                <input
                  type="checkbox"
                  name="includeUppercase"
                  checked={options.includeUppercase}
                  onChange={handleOptionChange}
                />
                Include Uppercase
              </CheckboxContainer>
            </OptionGroup>

            <OptionGroup>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  name="includeNumbers"
                  checked={options.includeNumbers}
                  onChange={handleOptionChange}
                />
                Include Numbers
              </CheckboxContainer>

              <CheckboxContainer>
                <input
                  type="checkbox"
                  name="includeSymbols"
                  checked={options.includeSymbols}
                  onChange={handleOptionChange}
                />
                Include Symbols
              </CheckboxContainer>
            </OptionGroup>

            <OptionGroup>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  name="excludeSimilar"
                  checked={options.excludeSimilar}
                  onChange={handleOptionChange}
                />
                Exclude Similar (il1Lo0O)
              </CheckboxContainer>

              <CheckboxContainer>
                <input
                  type="checkbox"
                  name="excludeAmbiguous"
                  checked={options.excludeAmbiguous}
                  onChange={handleOptionChange}
                />
                Exclude Ambiguous {`{ } [ ] ( ) / \\ ' " ~ , ; : . < >`}
              </CheckboxContainer>
            </OptionGroup>
          </OptionsGrid>

          <SliderContainer>
            <SliderLabel>
              <span>Number of Passwords</span>
              <span>{options.count}</span>
            </SliderLabel>
            <Slider type="range" name="count" min="1" max="25" value={options.count} onChange={handleOptionChange} />
          </SliderContainer>

          <ButtonGroup>
            <Button onClick={generatePasswords}>
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
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                <line x1="16" y1="8" x2="2" y2="22"></line>
                <line x1="17.5" y1="15" x2="9" y2="15"></line>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              Generate Passwords
            </Button>
            <Button onClick={copyAllToClipboard}>
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
            </Button>
          </ButtonGroup>
        </Card>

        <ResultsContainer>
          <ResultsLabel>Generated Passwords ({passwords.length})</ResultsLabel>
          <TextArea readOnly value={passwords.join("\n")} onClick={(e) => (e.target as HTMLTextAreaElement).select()} />
        </ResultsContainer>
      </Container>
    </>
  );
};

export default PasswordGeneratorPage;
