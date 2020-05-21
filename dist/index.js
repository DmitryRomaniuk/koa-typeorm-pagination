"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.paginate = exports.IndexablePage = exports.IndexedPage = exports.ArrayPage = exports.Page = exports.Pageable = exports.Sort = exports.Order = exports.Direction = exports.InvalidSortError = exports.NumberFormatError = exports.KoaPageableError = void 0;
var lodash_1 = require("lodash");
/**
 * Base Class for error types thrown by Koa Paginate.
 *
 * @param message The human-readable message describing the error
 */
var KoaPageableError = /** @class */ (function (_super) {
    __extends(KoaPageableError, _super);
    function KoaPageableError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'KoaPageableError';
        _this.message = message;
        _this.stack = new Error().stack;
        return _this;
    }
    /**
     * HTTP Status code to be returned, 400
     */
    KoaPageableError.status = 400;
    return KoaPageableError;
}(Error));
exports.KoaPageableError = KoaPageableError;
/**
 * Error type thrown when parsing Pagination parameters fails
 * @param message The human-readable message describing the error
 */
var NumberFormatError = /** @class */ (function (_super) {
    __extends(NumberFormatError, _super);
    function NumberFormatError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'NumberFormatError';
        _this.message = message;
        _this.stack = new Error().stack;
        return _this;
    }
    NumberFormatError.status = 400;
    return NumberFormatError;
}(KoaPageableError));
exports.NumberFormatError = NumberFormatError;
/**
 * Error type thrown when an invalid Sort Direction is provided on the request.
 */
var InvalidSortError = /** @class */ (function (_super) {
    __extends(InvalidSortError, _super);
    function InvalidSortError() {
        var _this = this;
        var msg = 'Invalid Sort Direction, must be one of "asc" or "desc"';
        _this = _super.call(this, msg) || this;
        _this.name = 'InvalidSortError';
        _this.message = msg;
        _this.stack = new Error().stack;
        return _this;
    }
    InvalidSortError.status = 400;
    return InvalidSortError;
}(KoaPageableError));
exports.InvalidSortError = InvalidSortError;
/**
 * Converts the input into a number it it's a valid numeric string, otherwise it throws a NumberFormatError
 *
 * @param input Input to convert to number
 * @returns Numeric value of string
 */
function parseIntOrThrow(input) {
    var result = parseInt(input, 10);
    if (Number.isNaN(result)) {
        throw new NumberFormatError("Could not convert '" + input + "' to number");
    }
    return result;
}
/**
 * Converts the input to a number if it's a valid numeric string using {@link parseIntOrThrow}. If the input isn't
 * specified, returns null
 *
 * @param input Input to convert to number
 * @returns Null or numeric value of string
 */
function parseOptionalIntOrThrow(input) {
    if (!input) {
        return null;
    }
    return parseIntOrThrow(input);
}
/**
 * Enumeration of sort directions
 * @type {{asc: string, desc: string}}
 * @enum {string}
 */
var Direction;
(function (Direction) {
    Direction["asc"] = "asc";
    Direction["desc"] = "desc";
})(Direction = exports.Direction || (exports.Direction = {}));
/**
 * Pairing of a property and a {@link Direction}. Represents a single property that should be ordered as part of a
 * {@link Sort}
 * @param property The property to be ordered
 * @param direction The direction of the ordering, defaults to {@link Direction.asc}
 */
var Order = /** @class */ (function () {
    function Order(property, direction) {
        if (direction === void 0) { direction = Order._DEFAULT_DIRECTION; }
        this.direction = Order._DEFAULT_DIRECTION;
        // only set it to desc if it's an exact match, else default
        if (direction.toLowerCase() === Direction.desc) {
            this.direction = Direction.desc;
        }
        this.property = property;
    }
    Order._DEFAULT_DIRECTION = Direction.asc;
    return Order;
}());
exports.Order = Order;
/**
 * Function that converts between a string and a {@link Direction}
 * @param dir The string to convert into a typed {@link Direction}
 * @returns {Direction} If the parameter exactly matches "asc" or "desc" returns the corresponding
 * {@link Direction}. If dir is blank the default direction {@link Direction.asc} will be returned. Else an
 *   {@link InvalidSortError} is thrown
 */
function stringToDirection(dir) {
    if (lodash_1.isEmpty(dir)) {
        return Order._DEFAULT_DIRECTION;
    }
    if (dir === Direction.asc) {
        return Direction.asc;
    }
    else if (dir === Direction.desc) {
        return Direction.desc;
    }
    throw new InvalidSortError();
}
/**
 * Sort options that should be applied to returned data set. Represents an iterable list of ordered properties.
 * @param orders Array of {@link Order} instances
 */
var Sort = /** @class */ (function () {
    function Sort(orders) {
        this.orders = orders;
    }
    Sort.prototype[Symbol.iterator] = function () {
        var values = Object.values(this.orders);
        var count = 0;
        var done = false;
        var next = function () {
            done = count >= values.length;
            var value = values[(count += 1)];
            return { done: done, value: value };
        };
        return { next: next };
    };
    /**
     * Provides ability to execute Sort.forEach(...) and iterate over its contained list of {@link Order}s.
     *
     * @param iteratee Function invoked with and provided with each {@link Order}'s (property, direction) pair as
     *   arguments
     */
    Sort.prototype.forEach = function (iteratee) {
        this.orders.forEach(function (it) { return iteratee(it.property, it.direction); });
    };
    /**
     * Overrides default serialization to  serialize the orders directly instead of serializing the Sort with a nested
     * order list
     */
    Sort.prototype.toJSON = function () {
        return this.orders;
    };
    return Sort;
}());
exports.Sort = Sort;
/**
 * Convert query param(s) into a Sort object. Supports both single (&foo=bar) and multi-value (&foo=bar&foo=baz) params
 *
 * @param sortRequestQuery Query param(s) to sort by
 * @returns Instance of Sort
 * @throws {@link InvalidSortError} if requested direction is not "asc" or "desc"
 */
function parseSort(sortRequestQuery) {
    var paramArray;
    // Multi-value params - convert to flat list of string
    if (Array.isArray(sortRequestQuery)) {
        paramArray = lodash_1.flatMap(sortRequestQuery.map(function (it) { return it.split(','); }));
    }
    else {
        // single param
        paramArray = sortRequestQuery.split(',');
    }
    // Ensure that only valid values are used (multiple commas are excluded).
    var validArray = paramArray.filter(function (param) { return param.length > 0; });
    var orderList = validArray.map(function (it) {
        // Ensure that only valid values are used (if multiple colons were specified in error).
        var result = it.split(':').filter(function (value) { return value.length > 0; });
        return new Order(result[0], stringToDirection(result[1]));
    });
    return new Sort(orderList);
}
/**
 * Represents the configuration for a page of elements. Created by the middleware based on the request query parameters
 * @param pageNumber The page to be returned
 * @param pageSize The number of elements to be returned
 * @param indexed The format to return the results in.
 * If true and the type of the content being returned supports it (has an `id` property), the result will contain a
 *   (potentially ordered, based on `sort`) list of `ids` and a corresponding map of `{id: content item}`, else content
 *   returned as a simple array. Default value is false.
 * @param sort Optional. The order to return the results in, ordered list of property, {@link Direction}.
 */
var Pageable = /** @class */ (function () {
    function Pageable(pageNumber, pageSize, indexed, sort) {
        if (pageNumber === void 0) { pageNumber = 0; }
        if (pageSize === void 0) { pageSize = 20; }
        if (indexed === void 0) { indexed = false; }
        this.page = pageNumber;
        this.size = pageSize;
        this.indexed = indexed;
        if (sort) {
            if (sort instanceof Sort) {
                this.sort = sort;
            }
            else {
                this.sort = parseSort(sort);
            }
        }
    }
    return Pageable;
}());
exports.Pageable = Pageable;
/**
 * "Base class" for container for content being returned.
 * @param totalElements The total number of elements in the data set
 * @param pageable The {@link Pageable} containing the paging information
 */
var Page = /** @class */ (function () {
    function Page(totalElements, pageable) {
        this.number = pageable.page;
        this.size = pageable.size;
        this.sort = pageable.sort;
        this.totalElements = totalElements;
        // calculated values
        this.totalPages = Math.max(Math.ceil(totalElements / this.size), 1);
        this.first = this.number === 0;
        this.last = this.number >= this.totalPages - 1;
    }
    return Page;
}());
exports.Page = Page;
// Sadly documentation.js does not reasonably  handle inheritance
// (https://github.com/documentationjs/documentation/issues/390)  Can remove the duplicated constructor parameters on
// children of Page once the above is resolved.
/**
 * Represents a sublist of a list of objects. Provides details about the total list, including whether there is more
 * data available.
 * @param content The content to be returned
 * @param totalElements The total number of elements in the data set
 * @param pageable The {@link Pageable} containing the paging information
 */
var ArrayPage = /** @class */ (function (_super) {
    __extends(ArrayPage, _super);
    function ArrayPage(content, totalElements, pageable) {
        if (content === void 0) { content = []; }
        var _this = _super.call(this, totalElements, pageable) || this;
        _this.content = content;
        _this.numberOfElements = _this.content.length;
        return _this;
    }
    /**
     * Returns a new Page created by invoking `iteratee` on each element in `content`
     *
     * @param iteratee Method to transform content elements
     * @returns Instance of Page
     */
    ArrayPage.prototype.map = function (iteratee) {
        return new ArrayPage(this.content.map(iteratee), this.totalElements, new Pageable(this.number, this.size, false, this.sort));
    };
    return ArrayPage;
}(Page));
exports.ArrayPage = ArrayPage;
/**
 * A page that has its content normalized into an array of ids and a corresponding map of `{id : content item }`
 * @param ids Array of content ids
 * @param index Map of Id to Content Items
 * @param totalElements The total number of elements in the data set
 * @param pageable The {@link Pageable} containing the paging information
 */
var IndexedPage = /** @class */ (function (_super) {
    __extends(IndexedPage, _super);
    function IndexedPage(ids, index, totalElements, pageable) {
        var _this = _super.call(this, totalElements, pageable) || this;
        _this.ids = ids;
        _this.index = index;
        _this.numberOfElements = Object.values(index).length;
        return _this;
    }
    /**
     * Returns a new {@link IndexedPage} created by running each element of `index` through iteratee
     * @param iteratee Method to transform content elements
     * @returns Transformed {@link IndexedPage}
     */
    IndexedPage.prototype.map = function (iteratee) {
        var mappedIndex = lodash_1.mapValues(this.index, iteratee);
        return new IndexedPage(this.ids, mappedIndex, this.totalElements, new Pageable(this.number, this.size, true, this.sort));
    };
    return IndexedPage;
}(Page));
exports.IndexedPage = IndexedPage;
/**
 * Page type that can be serialized to json  as either an {@ArrayPage} or {@IndexedPage}.
 *
 * In order to achieve this, _all_ elements in the content array *must* have an `id` property.
 *
 * Then, upon serialization, if the `indexed` value is true, the content is grouped by `id` to obtain the map of `{id:
 * content item}` and  written as an {@link IndexedPage}, else it is written as an {@link ArrayPage}
 *
 * @param content The content to be returned
 * @param totalElements The total number of elements in the data set
 * @param pageable The {@link Pageable} containing the paging information
 */
var IndexablePage = /** @class */ (function (_super) {
    __extends(IndexablePage, _super);
    function IndexablePage(content, totalElements, pageable) {
        if (content === void 0) { content = []; }
        var _this = _super.call(this, totalElements, pageable) || this;
        _this.indexed = false;
        _this.content = content;
        _this.indexed = pageable.indexed;
        _this.numberOfElements = _this.content.length;
        return _this;
    }
    /**
     * Returns a new {@link IndexablePage} created by running each element of `content` through iteratee
     * @param iteratee Method to transform content elements
     * @returns Transformed {@link IndexablePage}
     */
    IndexablePage.prototype.map = function (iteratee) {
        return new IndexablePage(this.content.map(iteratee), this.totalElements, new Pageable(this.number, this.size, this.indexed, this.sort));
    };
    /**
     * Json Serialization that checks `indexed` property, and returns an {@link IndexedPage} if true, else
     * {@link ArrayPage}
     * @returns {Page}
     */
    IndexablePage.prototype.toJSON = function () {
        if (this.indexed) {
            var ids = this.content.map(function (it) { return it.id; });
            var contentById = lodash_1.keyBy(this.content, 'id');
            return new IndexedPage(ids, contentById, this.totalElements, new Pageable(this.number, this.size, this.indexed, this.sort));
        }
        return new ArrayPage(this.content, this.totalElements, new Pageable(this.number, this.size, this.indexed, this.sort));
    };
    return IndexablePage;
}(Page));
exports.IndexablePage = IndexablePage;
/**
 * Koa Middleware function that reads pagination parameters from the query string, and populate `ctx.state.pageable`
 * with a {@link Pageable} instance.
 *
 * @param ctx Context associated with the Koa middleware function
 * @param next Middleware function called after {@link Pageable} property is set in state
 * @returns {Promise}
 */
function paginate(ctx, next) {
    return __awaiter(this, void 0, void 0, function () {
        var page, size, sort, indexed;
        return __generator(this, function (_a) {
            page = parseOptionalIntOrThrow(ctx.query.page) || 0;
            size = parseOptionalIntOrThrow(ctx.query.size) || 20;
            sort = ctx.query.sort || null;
            indexed = ctx.query.indexed === 'true';
            ctx.state.pageable = new Pageable(page, size, indexed, sort);
            return [2 /*return*/, next()];
        });
    });
}
exports.paginate = paginate;
