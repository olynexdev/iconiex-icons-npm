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
const dotenv_1 = __importDefault(require("dotenv"));
const senitizeName_1 = require("./lib/senitizeName");
const attributeToCamelCase_1 = require("./lib/attributeToCamelCase");
// Load environment variables
dotenv_1.default.config();
const serverUrl = process.env.SERVER_URL;
if (!serverUrl) {
    throw new Error("SERVER_URL is not defined in .env");
}
const iconDir = path_1.default.join(__dirname, "icons");
const iconsFilePath = path_1.default.join(iconDir, "icons.tsx");
const indexFilePath = path_1.default.join(__dirname, "index.ts");
// Ensure icons directory exists
if (!fs_1.default.existsSync(iconDir)) {
    fs_1.default.mkdirSync(iconDir, { recursive: true });
}
// Clear files before writing new content
fs_1.default.writeFileSync(iconsFilePath, "");
fs_1.default.writeFileSync(indexFilePath, "");
// Generate icon module with all components
function generateIconModule(icons) {
    const header = `import React, { FC } from 'react';\nimport { IconProps } from '../types';\n\n`;
    const iconComponents = icons
        .map(({ tagname, icon }) => {
        const componentName = `Ix${(0, senitizeName_1.sanitizeName)(tagname)}`;
        const processedSvg = (0, attributeToCamelCase_1.processSvg)(icon);
        return `export const ${componentName}: FC<IconProps> = ({\n  className = '',\n  style = {},\n  ...props\n}) => (\n  ${processedSvg}\n);`;
    })
        .join("\n\n");
    return header + iconComponents;
}
// Generate index.ts with single export
function generateIndexFile() {
    return `export * from './icons/icons';\n`;
}
// Main generation function
function generateIcons() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Fetching icons from server...");
        try {
            const response = yield fetch(serverUrl);
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            const data = yield response.json();
            if (!data.length)
                return console.warn("No icons found");
            // Generate icons.tsx with all components
            const iconModuleContent = generateIconModule(data);
            fs_1.default.writeFileSync(iconsFilePath, iconModuleContent);
            // Generate index.ts with single export
            const indexContent = generateIndexFile();
            fs_1.default.writeFileSync(indexFilePath, indexContent);
            console.log(`Successfully generated ${data.length} icons`);
            console.log(`Icons file: ${iconsFilePath}`);
            console.log(`Index file: ${indexFilePath}`);
        }
        catch (error) {
            console.error("Generation failed:", error);
            process.exit(1);
        }
    });
}
// Execute generation
generateIcons();
