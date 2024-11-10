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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("./utils/helpers");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Now you can access the variables
const serverUrl = process.env.SERVER_URL;
console.log(serverUrl);
if (!serverUrl) {
    throw new Error("SERVER_URL is not defined in the environment variables.");
}
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
    return `import React from 'react';
import { IconProps } from '../types';

const ${componentName}: React.FC<IconProps> = ({ className = '', style = {}, ...props }) => (
  ${updatedSvgMarkup}
);

export default ${componentName};`;
}
// Function to fetch icons from the server and generate components
function generateIcons() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Fetching icons from the server...");
        try {
            const response = yield fetch(`${serverUrl}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            const icons = data;
            // 1. Get the existing files in the icons directory
            const existingFiles = fs_1.default
                .readdirSync(iconDir)
                .map((file) => path_1.default.basename(file, ".tsx"));
            const existingIcons = new Set(existingFiles);
            // 2. Loop through the icons from the server and generate their components
            for (const { title, icon } of icons) {
                const componentName = `Ix${(0, helpers_1.toCamelCase)(title)}`;
                // 3. If the icon exists, regenerate it
                if (existingIcons.has(componentName)) {
                    const componentCode = generateIconComponent(title, icon);
                    const filePath = path_1.default.join(iconDir, `${componentName}.tsx`);
                    fs_1.default.writeFileSync(filePath, componentCode);
                    // Add the import statement for the component
                    const importStatement = `export { default as ${componentName} } from './icons/${componentName}';\n`;
                    fs_1.default.appendFileSync(indexFilePath, importStatement);
                }
                else {
                    // 4. Create new icons that don't exist yet
                    const componentCode = generateIconComponent(title, icon);
                    const filePath = path_1.default.join(iconDir, `${componentName}.tsx`);
                    fs_1.default.writeFileSync(filePath, componentCode);
                    // Add the import statement for the component
                    const importStatement = `export { default as ${componentName} } from './icons/${componentName}';\n`;
                    fs_1.default.appendFileSync(indexFilePath, importStatement);
                    existingIcons.add(componentName); // Add it to the set of existing icons
                }
            }
            // 5. Remove icons from the `icons` directory that no longer exist in the backend
            const iconsToRemove = existingFiles.filter((file) => !icons.some((icon) => (0, helpers_1.toCamelCase)(icon.title) === file));
            iconsToRemove.forEach((iconToRemove) => {
                const filePath = path_1.default.join(iconDir, `${iconToRemove}.tsx`);
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
                // Remove the import statement from the index.ts file
                const importStatementToRemove = `export { default as ${iconToRemove} } from './icons/${iconToRemove}';\n`;
                const indexFileContent = fs_1.default.readFileSync(indexFilePath, "utf-8");
                const updatedIndexFileContent = indexFileContent.replace(importStatementToRemove, "");
                fs_1.default.writeFileSync(indexFilePath, updatedIndexFileContent);
            });
            console.log("Icons generated and cleaned up successfully.");
        }
        catch (error) {
            console.error("Error fetching icons:", error);
        }
    });
}
// Call the function to fetch icons and generate components
generateIcons();
