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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const typeorm_1 = require("typeorm");
const pagination_1 = require("./pagination");
function paginate(repositoryOrQueryBuilder, options, searchOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        return repositoryOrQueryBuilder instanceof typeorm_1.Repository
            ? paginateRepository(repositoryOrQueryBuilder, options, searchOptions)
            : paginateQueryBuilder(repositoryOrQueryBuilder, options);
    });
}
exports.paginate = paginate;
function createPaginationObject(content, totalItems, current, pageSize) {
    const totalPages = Math.ceil(totalItems / pageSize);
    return new pagination_1.Pagination(content, {
        itemCount: content.length,
        total: totalItems,
        pageSize: pageSize,
        totalPages: totalPages,
        current: current,
    });
}
function resolveOptions(options) {
    const current = options.current;
    const pageSize = options.pageSize;
    return [current, pageSize];
}
function paginateRepository(repository, options, searchOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const [page, limit] = resolveOptions(options);
        if (page < 1) {
            return createPaginationObject([], 0, page, limit);
        }
        const [items, total] = yield repository.findAndCount(Object.assign({ skip: limit * (page - 1), take: limit }, searchOptions));
        return createPaginationObject(items, total, page, limit);
    });
}
function paginateQueryBuilder(queryBuilder, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const [page, limit] = resolveOptions(options);
        const [items, total] = yield queryBuilder
            .take(limit)
            .skip((page - 1) * limit)
            .getManyAndCount();
        return createPaginationObject(items, total, page, limit);
    });
}
