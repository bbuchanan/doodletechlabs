# JSON Editor & Formatter

A modern, feature-rich JSON editor built with React. This application allows you to format, visualize, search, and extract data from JSON files.

## Features

- **JSON Formatting**: Automatically formats and validates your JSON.
- **Tree Visualization**: View your JSON in a collapsible tree structure.
- **Expand/Collapse**: Easily expand or collapse all nodes.
- **Search**: Find specific values or keys in your JSON data.
- **Path Extraction**: Extract specific nodes using dot notation paths.
- **Copy & Download**: Copy formatted JSON to clipboard or download as a file.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/json-editor.git
   cd json-editor
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Usage

1. **Input JSON**: Paste your JSON in the input area or use the "Load Sample" button.
2. **Format**: Click "Format" to beautify your JSON with proper indentation.
3. **View**: The JSON Viewer will display your data as a collapsible tree.
4. **Search**: Enter a search term to find matching keys or values.
5. **Extract**: Use dot notation (e.g., `user.address.city`) to extract specific nodes.

### Path Notation for Extraction

- Use dot notation for nested objects: `user.address.street`
- For arrays, use index notation: `users[0].name`

## Building for Production

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `build` folder.

## Technologies Used

- React
- TypeScript
- Monaco Editor
- react-json-tree
- Emotion (styled components)

## Future Enhancements

- Dark/light theme toggle
- JSON schema validation
- Save and load JSON from local storage
- Import from URL
- Diff comparison between JSON objects
- Custom styling for the JSON tree

## License

This project is licensed under the MIT License - see the LICENSE file for details.
