"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowser = typeof window !== "undefined";
function createQueryParams(params) {
    return Object.keys(params)
        .map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]); })
        .join("&");
}
exports.createQueryParams = createQueryParams;
