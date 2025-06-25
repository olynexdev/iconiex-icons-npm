"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSvg = void 0;
function processSvg(svg) {
    return (svg
        // Convert attributes to camelCase
        .replace(/(\w+)-(\w+)=/g, (_, first, second) => `${first}${second[0].toUpperCase()}${second.slice(1)}=`)
        // Move props to the end of opening SVG tag
        .replace(/<svg([^>]*)>/, `<svg$1 {...props} className={className} style={style}>`));
}
exports.processSvg = processSvg;
