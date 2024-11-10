"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const IxBox = (_a) => {
    var { className = '', style = {} } = _a, props = __rest(_a, ["className", "style"]);
    return (react_1.default.createElement("svg", { className: className, style: style, xmlns: "http://www.w3.org/2000/svg", color: "currentColor", width: "1em", height: "1em", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
        react_1.default.createElement("polyline", { points: "21 8 21 21 3 21 3 8" }),
        react_1.default.createElement("rect", { x: "1", y: "3", width: "22", height: "5" }),
        react_1.default.createElement("line", { x1: "10", y1: "12", x2: "14", y2: "12" })));
};
exports.default = IxBox;
