// src/generateIcons.ts
import fs from "fs";
import path from "path";
import axios from "axios";
import { toCamelCase } from "./utils/helpers";

interface IconData {
  title: string;
  icon: string;
  npm_tag: string;
}

const iconDir = path.join(__dirname, "icons");
const indexFilePath = path.join(__dirname, "index.ts");

if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir);
}

fs.writeFileSync(indexFilePath, ""); // Clear the file before writing new imports

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

async function generateIcons() {
  try {
    const response = await axios.get("https://iconiex-server.vercel.app/v1/icons");
    const icons: IconData[] = response.data.icons;

    for (const { title, icon } of icons) {
      const componentName = `Ix${toCamelCase(title)}`;
      const componentCode = generateIconComponent(title, icon);
      const filePath = path.join(iconDir, `${componentName}.tsx`);
      fs.writeFileSync(filePath, componentCode);
      const importStatement = `export { default as ${componentName} } from './icons/${componentName}';\n`;
      fs.appendFileSync(indexFilePath, importStatement);
    }

    console.log("Icons generated successfully.");
  } catch (error) {
    console.error("Error fetching icons:", error);
  }
}

generateIcons();
