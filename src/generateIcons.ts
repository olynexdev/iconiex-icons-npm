import fs from "fs";
import path from "path";
import { toCamelCase } from "./utils/helpers";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Now you can access the variables
const serverUrl = process.env.SERVER_URL;
console.log(serverUrl);

if (!serverUrl) {
  throw new Error("SERVER_URL is not defined in the environment variables.");
}

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

  return `import React from 'react';
import { IconProps } from '../types';

const ${componentName}: React.FC<IconProps> = ({ className = '', style = {}, ...props }) => (
  ${updatedSvgMarkup}
);

export default ${componentName};`;
}

// Function to fetch icons from the server and generate components
async function generateIcons() {
  console.log("Fetching icons from the server...");
  try {
    const response = await fetch(`${serverUrl}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const icons: IconData[] = data;
 

    // 1. Get the existing files in the icons directory
    const existingFiles = fs
      .readdirSync(iconDir)
      .map((file) => path.basename(file, ".tsx"));
    const existingIcons = new Set(existingFiles);

    // 2. Loop through the icons from the server and generate their components
    for (const { title, icon } of icons) {
      const componentName = `Ix${toCamelCase(title)}`;

      // 3. If the icon exists, regenerate it
      if (existingIcons.has(componentName)) {
        const componentCode = generateIconComponent(title, icon);
        const filePath = path.join(iconDir, `${componentName}.tsx`);
        fs.writeFileSync(filePath, componentCode);

        // Add the import statement for the component
        const importStatement = `export { default as ${componentName} } from './icons/${componentName}';\n`;
        fs.appendFileSync(indexFilePath, importStatement);
      } else {
        // 4. Create new icons that don't exist yet
        const componentCode = generateIconComponent(title, icon);
        const filePath = path.join(iconDir, `${componentName}.tsx`);
        fs.writeFileSync(filePath, componentCode);

        // Add the import statement for the component
        const importStatement = `export { default as ${componentName} } from './icons/${componentName}';\n`;
        fs.appendFileSync(indexFilePath, importStatement);

        existingIcons.add(componentName); // Add it to the set of existing icons
      }
    }

    // 5. Remove icons from the `icons` directory that no longer exist in the backend
    const iconsToRemove = existingFiles.filter(
      (file) => !icons.some((icon) => toCamelCase(icon.title) === file)
    );

    iconsToRemove.forEach((iconToRemove) => {
      const filePath = path.join(iconDir, `${iconToRemove}.tsx`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Remove the import statement from the index.ts file
      const importStatementToRemove = `export { default as ${iconToRemove} } from './icons/${iconToRemove}';\n`;
      const indexFileContent = fs.readFileSync(indexFilePath, "utf-8");
      const updatedIndexFileContent = indexFileContent.replace(
        importStatementToRemove,
        ""
      );
      fs.writeFileSync(indexFilePath, updatedIndexFileContent);
    });

    console.log("Icons generated and cleaned up successfully.");
  } catch (error) {
    console.error("Error fetching icons:", error);
  }
}

// Call the function to fetch icons and generate components
generateIcons();
