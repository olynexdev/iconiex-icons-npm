import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const serverUrl = process.env.SERVER_URL;
if (!serverUrl) {
  throw new Error("SERVER_URL is not defined in the environment variables.");
}

interface IconData {
  tagname: string;
  icon: string;
  npm_tag: string;
}

const iconDir = path.join(__dirname, "icons");
const iconsFilePath = path.join(iconDir, "icons.tsx");
const indexFilePath = path.join(__dirname, "index.ts");

// Ensure the icons directory exists, or create it
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Clear the index.ts file before writing new imports
fs.writeFileSync(indexFilePath, "");

// Function to create a single export line for an icon
function generateExportLine(tagname: string): string {
  const componentName = `Ix${tagname}`;
  return `export { ${componentName} } from './icons/icons';\n`;
}

// Function to create the icon module (one module for all icons) using named exports
// Function to create the icon module (one module for all icons) using named exports
function generateIconModule(icons: IconData[]): string {
  let moduleContent = `import { IconProps } from '../types';\n\n`;

  // Generate the icon components with named exports
  moduleContent += icons
    .map(({ tagname, icon }) => {
      const componentName = `Ix${tagname}`;  // Ensure no extra period here
      const updatedSvgMarkup = icon.replace(
        /<svg([^>]*)/,
        `<svg className={className} style={style} $1`
      );
      return `export const ${componentName} = ({ className = '', style = {}, ...props }: IconProps) => (\n  ${updatedSvgMarkup}\n);\n`; // No period here
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

    const data: IconData[] = await response.json();

    if (data.length === 0) {
      console.warn("No icons found from the server.");
      return;
    }

    // Generate content for icons.tsx file (icon components with named exports)
    const iconModuleContent = generateIconModule(data);
    fs.writeFileSync(iconsFilePath, iconModuleContent);

    // Generate export lines for each icon, pointing to icons.tsx, and write to index.ts
    const exportLines = data
      .map(({ tagname }) => generateExportLine(tagname))
      .join("");
    fs.writeFileSync(indexFilePath, exportLines);

    console.log("Icons generated and index.ts updated successfully.");
  } catch (error) {
    console.error("Error fetching icons:", error);
  }
}

// Call the function to fetch icons and generate components
generateIcons();
