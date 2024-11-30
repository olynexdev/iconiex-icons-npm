import fs from "fs";
import path from "path";
import { toCamelCase } from "./utils/helpers";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();
const serverUrl = process.env.SERVER_URL;
if (!serverUrl) {
  throw new Error("SERVER_URL is not defined in the environment variables.");
}
interface IconData {
  title: string;
  icon: string;
  npm_tag: string;
}
const iconDir = path.join(__dirname, "icons");
const iconsFilePath = path.join(iconDir, "icons.tsx");
const indexFilePath = path.join(__dirname, "index.ts");
// Ensure the icons directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir);
}
// Clear the index.ts file before writing new imports
fs.writeFileSync(indexFilePath, "");
// Function to create a single export line for an icon
function generateExportLine(title: string): string {
  const componentName = `Ix${toCamelCase(title)}`;
  return `export { ${componentName} } from './icons/icons';\n`;
}
// Function to create the icon module (one module for all icons) using named exports
function generateIconModule(icons: IconData[]): string {
  let moduleContent = `import React from 'react';\nimport { IconProps } from '../types';\n\n`;
  // Generate the icon components with named exports
  moduleContent += icons
    .map(({ title, icon }) => {
      const componentName = `Ix${toCamelCase(title)}`;
      const updatedSvgMarkup = icon.replace(
        /<svg([^>]*)/,
        `<svg className={className} style={style} $1`
      );
      return `export const ${componentName}: React.FC<IconProps> = ({ className = '', style = {}, ...props }) => (\n  ${updatedSvgMarkup}\n);\n`;
    })
    .join("\n");
  return moduleContent;
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
    // Generate content for icons.tsx file (icon components with named exports)
    const iconModuleContent = generateIconModule(icons);
    fs.writeFileSync(iconsFilePath, iconModuleContent);
    // Generate export lines for each icon, pointing to icons.tsx, and write to index.ts
    const exportLines = icons
      .map(({ title }) => generateExportLine(title))
      .join("");
    fs.writeFileSync(indexFilePath, exportLines);
    console.log("Icons generated and index.ts updated successfully.");
  } catch (error) {
    console.error("Error fetching icons:", error);
  }
}
// Call the function to fetch icons and generate components
generateIcons();
