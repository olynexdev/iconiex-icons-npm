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
// Load environment variables from .env file
dotenv_1.default.config();
const serverUrl = process.env.SERVER_URL;
if (!serverUrl) {
    throw new Error("SERVER_URL is not defined in the environment variables.");
}
const iconDir = path_1.default.join(__dirname, "icons");
const iconsFilePath = path_1.default.join(iconDir, "icons.tsx");
const indexFilePath = path_1.default.join(__dirname, "index.ts");
// Ensure the icons directory exists, or create it
if (!fs_1.default.existsSync(iconDir)) {
    fs_1.default.mkdirSync(iconDir, { recursive: true });
}
// Clear the index.ts file before writing new imports
fs_1.default.writeFileSync(indexFilePath, "");
// Function to create a single export line for an icon
function generateExportLine(tagname) {
    const componentName = `Ix${tagname}`;
    return `export { ${componentName} } from './icons/icons';\n`;
}
// Function to create the icon module (one module for all icons) using named exports
// Function to create the icon module (one module for all icons) using named exports
function generateIconModule(icons) {
    let moduleContent = `import { IconProps } from '../types';\n\n`;
    // Generate the icon components with named exports
    moduleContent += icons
        .map(({ tagname, icon }) => {
        const componentName = `Ix${tagname}`; // Ensure no extra period here
        const updatedSvgMarkup = icon.replace(/<svg([^>]*)/, `<svg className={className} style={style} $1`);
        return `export const ${componentName} = ({ className = '', style = {}, ...props }: IconProps) => (\n  ${updatedSvgMarkup}\n);\n`; // No period here
    })
        .join("\n");
    return moduleContent;
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
            if (data.length === 0) {
                console.warn("No icons found from the server.");
                return;
            }
            // Generate content for icons.tsx file (icon components with named exports)
            const iconModuleContent = generateIconModule(data);
            fs_1.default.writeFileSync(iconsFilePath, iconModuleContent);
            // Generate export lines for each icon, pointing to icons.tsx, and write to index.ts
            const exportLines = data
                .map(({ tagname }) => generateExportLine(tagname))
                .join("");
            fs_1.default.writeFileSync(indexFilePath, exportLines);
            console.log("Icons generated and index.ts updated successfully.");
        }
        catch (error) {
            console.error("Error fetching icons:", error);
        }
    });
}
// Call the function to fetch icons and generate components
generateIcons();
