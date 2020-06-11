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
exports.paginateMiddleware = exports.Pageable = exports.Sort = exports.Order = exports.Direction = exports.InvalidSortError = exports.NumberFormatError = exports.KoaPageableError = void 0;
const lodash_1 = require("lodash");
/**
 * Base Class for error types thrown by Koa Paginate.
 *
 * @param message The human-readable message describing the error
 */
let KoaPageableError = /** @class */ (() => {
    class KoaPageableError extends Error {
        constructor(message) {
            super(message);
            this.name = 'KoaPageableError';
            this.message = message;
            this.stack = new Error().stack;
        }
    }
    /**
     * HTTP Status code to be returned, 400
     */
    KoaPageableError.status = 400;
    return KoaPageableError;
})();
exports.KoaPageableError = KoaPageableError;
/**
 * Error type thrown when parsing Pagination parameters fails
 * @param message The human-readable message describing the error
 */
let NumberFormatError = /** @class */ (() => {
    class NumberFormatError extends KoaPageableError {
        constructor(message) {
            super(message);
            this.name = 'NumberFormatError';
            this.message = message;
            this.stack = new Error().stack;
        }
    }
    NumberFormatError.status = 400;
    return NumberFormatError;
})();
exports.NumberFormatError = NumberFormatError;
/**
 * Error type thrown when an invalid Sort Direction is provided on the request.
 */
let InvalidSortError = /** @class */ (() => {
    class InvalidSortError extends KoaPageableError {
        constructor() {
            const msg = 'Invalid Sort Direction, must be one of "asc" or "desc"';
            super(msg);
            this.name = 'InvalidSortError';
            this.message = msg;
            this.stack = new Error().stack;
        }
    }
    InvalidSortError.status = 400;
    return InvalidSortError;
})();
exports.InvalidSortError = InvalidSortError;
/**
 * Converts the input into a number it it's a valid numeric string, otherwise it throws a NumberFormatError
 *
 * @param input Input to convert to number
 * @returns Numeric value of string
 */
function parseIntOrThrow(input) {
    const result = parseInt(input, 10);
    if (Number.isNaN(result)) {
        throw new NumberFormatError(`Could not convert '${input}' to number`);
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
let Order = /** @class */ (() => {
    class Order {
        constructor(property, direction = Order._DEFAULT_DIRECTION) {
            this.direction = Order._DEFAULT_DIRECTION;
            // only set it to desc if it's an exact match, else default
            if (direction.toLowerCase() === Direction.desc) {
                this.direction = Direction.desc;
            }
            this.property = property;
        }
    }
    Order._DEFAULT_DIRECTION = Direction.asc;
    return Order;
})();
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
class Sort {
    constructor(orders) {
        this.orders = orders;
    }
    [Symbol.iterator]() {
        const values = Object.values(this.orders);
        let count = 0;
        let done = false;
        const next = () => {
            done = count >= values.length;
            const value = values[(count += 1)];
            return { done, value };
        };
        return { next };
    }
    /**
     * Provides ability to execute Sort.forEach(...) and iterate over its contained list of {@link Order}s.
     *
     * @param iteratee Function invoked with and provided with each {@link Order}'s (property, direction) pair as
     *   arguments
     */
    forEach(iteratee) {
        this.orders.forEach((it) => iteratee(it.property, it.direction));
    }
    /**
     * Overrides default serialization to  serialize the orders directly instead of serializing the Sort with a nested
     * order list
     */
    toJSON() {
        return this.orders;
    }
}
exports.Sort = Sort;
/**
 * Convert query param(s) into a Sort object. Supports both single (&foo=bar) and multi-value (&foo=bar&foo=baz) params
 *
 * @param sortRequestQuery Query param(s) to sort by
 * @returns Instance of Sort
 * @throws {@link InvalidSortError} if requested direction is not "asc" or "desc"
 */
function parseSort(sortRequestQuery) {
    let paramArray;
    // Multi-value params - convert to flat list of string
    if (Array.isArray(sortRequestQuery)) {
        paramArray = lodash_1.flatMap(sortRequestQuery.map((it) => it.split(',')));
    }
    else {
        // single param
        paramArray = sortRequestQuery.split(',');
    }
    // Ensure that only valid values are used (multiple commas are excluded).
    const validArray = paramArray.filter((param) => param.length > 0);
    const orderList = validArray.map((it) => {
        // Ensure that only valid values are used (if multiple colons were specified in error).
        const result = it.split(':').filter((value) => value.length > 0);
        return new Order(result[0], stringToDirection(result[1]));
    });
    return new Sort(orderList);
}
/**
 * Represents the configuration for a page of elements. Created by the middleware based on the request query parameters
 * @param pageNumber The page to be returned
 * @param pageSize The number of elements to be returned
 * @param sort Optional. The order to return the results in, ordered list of property, {@link Direction}.
 */
class Pageable {
    constructor(current = 0, pageSize = 20, sort) {
        this.current = current;
        this.pageSize = pageSize;
        if (sort) {
            if (sort instanceof Sort) {
                this.sort = sort;
            }
            else {
                this.sort = parseSort(sort);
            }
        }
    }
}
exports.Pageable = Pageable;
/**
 * Koa Middleware function that reads pagination parameters from the query string, and populate `ctx.state.pageable`
 * with a {@link Pageable} instance.
 *
 * @param ctx Context associated with the Koa middleware function
 * @param next Middleware function called after {@link Pageable} property is set in state
 * @returns {Promise}
 */
function paginateMiddleware(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = parseOptionalIntOrThrow(ctx.query.current) || 0;
        const size = parseOptionalIntOrThrow(ctx.query.pageSize) || 20;
        const sort = ctx.query.sort || null;
        ctx.state.pageable = new Pageable(page, size, sort);
        return next();
    });
}
exports.paginateMiddleware = paginateMiddleware;
exports.default = {
    paginateMiddleware,
    Order,
    Direction,
    InvalidSortError,
    KoaPageableError,
    NumberFormatError,
    Pageable,
    Sort,
};
