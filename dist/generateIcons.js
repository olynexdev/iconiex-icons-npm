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
const axios_1 = __importDefault(require("axios"));
const helpers_1 = require("./utils/helpers");
const iconDir = path_1.default.join(__dirname, "icons");
const indexFilePath = path_1.default.join(__dirname, "index.ts");
if (!fs_1.default.existsSync(iconDir)) {
    fs_1.default.mkdirSync(iconDir);
}
fs_1.default.writeFileSync(indexFilePath, ""); // Clear the file before writing new imports
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
function generateIcons() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get("https://iconiex-server.vercel.app/v1/icons");
            const icons = response.data.icons;
            for (const { title, icon } of icons) {
                const componentName = `Ix${(0, helpers_1.toCamelCase)(title)}`;
                const componentCode = generateIconComponent(title, icon);
                const filePath = path_1.default.join(iconDir, `${componentName}.tsx`);
                fs_1.default.writeFileSync(filePath, componentCode);
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
generateIcons();
