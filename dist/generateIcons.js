"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/generateIcons.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("./utils/helpers");
const iconDir = path_1.default.join(__dirname, "icons");
const indexFilePath = path_1.default.join(__dirname, "index.ts");
// Ensure the icons directory exists
if (!fs_1.default.existsSync(iconDir)) {
    fs_1.default.mkdirSync(iconDir);
}
// Clear the index.ts file before writing new imports
fs_1.default.writeFileSync(indexFilePath, "");
// Function to create React component code from SVG data
function generateIconComponent(title, svgMarkup) {
    const componentName = `Ix${(0, helpers_1.toCamelCase)(title)}`;
    const updatedSvgMarkup = svgMarkup.replace(/<svg([^>]*)/, `<svg className={className} style={style} $1`);
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
function generateIcons() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Fetching icons from the server..."); // Loading message
        try {
            const response = yield fetch("https://iconiex-server.vercel.app/v1/icons");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            const icons = data.icons; // Adjust based on your API response
            // Loop through each icon in the JSON file and generate its component
            for (const { title, icon } of icons) {
                const componentName = `Ix${(0, helpers_1.toCamelCase)(title)}`;
                const componentCode = generateIconComponent(title, icon);
                const filePath = path_1.default.join(iconDir, `${componentName}.tsx`);
                fs_1.default.writeFileSync(filePath, componentCode);
                // Create import statement and append it to index.ts
                const importStatement = `export { default as ${componentName} } from './icons/${componentName}';\n`;
                fs_1.default.appendFileSync(indexFilePath, importStatement);
            }
            console.log("Icons generated successfully.");
        }
        catch (error) {
            console.error("Error fetching icons:", error);
        }
    });
}
// Call the function to fetch icons and generate components
generateIcons();
