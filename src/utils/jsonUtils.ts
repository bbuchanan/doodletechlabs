/**
 * Utilities for working with JSON data
 */

/**
 * Validates if a string is valid JSON
 */
export const isValidJSON = (jsonString: string): boolean => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    return false;
  }
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
        const [_, propName, index] = arrayMatch;
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
