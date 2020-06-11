"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
class Pagination {
    constructor(
    /**
     * a list of items to be returned
     */
    content, 
    /**
     * associated meta information (e.g., counts)
     */
    pagination) {
        this.content = content;
        this.pagination = pagination;
    }
}
exports.Pagination = Pagination;
