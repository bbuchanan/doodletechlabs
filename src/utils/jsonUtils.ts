/**
 * Utilities for working with JSON data
 */

/**
 * Interface for JSON validation result
 */
export interface JsonValidationResult {
  isValid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
}

/**
 * Validates if a string is valid JSON and provides detailed error information
 */
export const validateJSON = (jsonString: string): JsonValidationResult => {
  try {
    JSON.parse(jsonString);
    return { isValid: true };
  } catch (e) {
    // Parse the error message to extract line and column information
    const error = e as Error;
    const message = error.message;

    // Example error message: "Unexpected token } in JSON at position 42"
    // or "Unexpected end of JSON input"
    const positionMatch = message.match(/at position (\d+)/);

    if (positionMatch) {
      const position = parseInt(positionMatch[1], 10);

      // Calculate line and column from position
      const lines = jsonString.substring(0, position).split("\n");
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;

      return {
        isValid: false,
        error: {
          message: message.replace(/in JSON at position \d+/, ""),
          line,
          column,
        },
      };
    }

    return {
      isValid: false,
      error: {
        message: message,
      },
    };
  }
};

/**
 * Legacy validation function (kept for backward compatibility)
 */
export const isValidJSON = (jsonString: string): boolean => {
  return validateJSON(jsonString).isValid;
};

/**
 * Format JSON string with proper indentation
 */
export const formatJSON = (jsonString: string): string => {
  try {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return jsonString;
  }
};

/**
 * Extracts nodes from JSON based on a key path
 * Example: "user.address.street" will extract the street property
 */
export const extractNodesByPath = (jsonData: any, path: string): any => {
  try {
    const parts = path.split(".");
    let result = jsonData;

    for (const part of parts) {
      if (result === null || result === undefined) {
        return undefined;
      }

      // Handle array indices like user.addresses[0]
      const arrayMatch = part.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        const [, propName, index] = arrayMatch;
        result = result[propName][parseInt(index)];
      } else {
        result = result[part];
      }
    }

    return result;
  } catch (e) {
    console.error("Error extracting node:", e);
    return undefined;
  }
};

/**
 * Search for nodes in JSON that match a search term
 * Returns an array of paths to matched nodes
 */
export const searchJSON = (
  obj: any,
  searchTerm: string,
  caseSensitive: boolean = false,
  currentPath: string = ""
): string[] => {
  if (!obj || typeof obj !== "object") {
    return [];
  }

  const paths: string[] = [];
  const term = caseSensitive ? searchTerm : searchTerm.toLowerCase();

  for (const key in obj) {
    const value = obj[key];
    const newPath = currentPath ? `${currentPath}.${key}` : key;

    // Check if the key matches
    const keyToCheck = caseSensitive ? key : key.toLowerCase();
    if (keyToCheck.includes(term)) {
      paths.push(newPath);
    }

    // Check if the value matches (only for primitive values)
    if (value !== null && value !== undefined && typeof value !== "object") {
      const valueStr = String(value);
      const valueToCheck = caseSensitive ? valueStr : valueStr.toLowerCase();
      if (valueToCheck.includes(term)) {
        paths.push(newPath);
      }
    }

    // Recursively search in nested objects and arrays
    if (value !== null && typeof value === "object") {
      const nestedPaths = searchJSON(value, searchTerm, caseSensitive, newPath);
      paths.push(...nestedPaths);
    }
  }

  return paths;
};
