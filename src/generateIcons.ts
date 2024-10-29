// src/generateIcons.ts
import fs from "fs";
import path from "path";
import { toCamelCase } from "./utils/helpers";

interface IconData {
  title: string;
  icon: string;
  npm_tag: string;
}

const iconDir = path.join(__dirname, "icons");
const indexFilePath = path.join(__dirname, "index.ts");

// Ensure the icons directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir);
}

// Clear the index.ts file before writing new imports
fs.writeFileSync(indexFilePath, "");

// Function to create React component code from SVG data
function generateIconComponent(title: string, svgMarkup: string): string {
  const componentName = `Ix${toCamelCase(title)}`;
  const updatedSvgMarkup = svgMarkup.replace(
    /<svg([^>]*)/,
    `<svg className={className} style={style} $1`
  );

  return `
import React from 'react';
import { IconProps } from './types';

const ${componentName}: React.FC<IconProps> = ({ className = '', style = {}, ...props }) => (
  ${updatedSvgMarkup}
);

export default ${componentName};
`;
}

// Function to fetch icons from the server and generate components
async function generateIcons() {
  console.log("Fetching icons from the server..."); // Loading message
  try {
    const response = await fetch("https://iconiex-server.vercel.app/v1/icons");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const icons: IconData[] = data.icons; // Adjust based on your API response

    // Loop through each icon in the JSON file and generate its component
    for (const { title, icon } of icons) {
      const componentName = `Ix${toCamelCase(title)}`;
      const componentCode = generateIconComponent(title, icon);
      const filePath = path.join(iconDir, `${componentName}.tsx`);
      fs.writeFileSync(filePath, componentCode);

      // Create import statement and append it to index.ts
      const importStatement = `export { default as ${componentName} } from './icons/${componentName}';\n`;
      fs.appendFileSync(indexFilePath, importStatement);
    }

    console.log("Icons generated successfully.");
  } catch (error) {
    console.error("Error fetching icons:", error);
  }
}

// Call the function to fetch icons and generate components
generateIcons();
