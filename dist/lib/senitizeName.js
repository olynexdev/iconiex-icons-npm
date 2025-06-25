"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeName = void 0;
function sanitizeName(name) {
    return name
        .replace(/[^a-zA-Z0-9]/g, "_")
        .replace(/^(\d)/, "_$1")
        .replace(/_+/g, "_");
}
exports.sanitizeName = sanitizeName;
