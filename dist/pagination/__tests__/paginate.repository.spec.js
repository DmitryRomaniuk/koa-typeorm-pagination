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
var index_1 = require("./../index");
var typeorm_1 = require("typeorm");
var pagination_1 = require("../pagination");
var MockRepository = /** @class */ (function (_super) {
    __extends(MockRepository, _super);
    function MockRepository(entityAmount) {
        var _this = _super.call(this) || this;
        _this.items = [];
        _this.findAndCount = function (options) { return __awaiter(_this, void 0, void 0, function () {
            var startIndex, endIndex, localItems;
            return __generator(this, function (_a) {
                startIndex = options.skip;
                endIndex = startIndex + options.take;
                localItems = this.items.slice(startIndex, endIndex);
                return [2 /*return*/, [localItems, this.items.length]];
            });
        }); };
        for (var i = 0; i < entityAmount; i++)
            _this.items.push(new Entity());
        return _this;
    }
    return MockRepository;
}(typeorm_1.Repository));
var Entity = /** @class */ (function () {
    function Entity() {
    }
    return Entity;
}());
describe('Test paginate function', function () {
    it('Can call method', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockRepository, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockRepository = new MockRepository(0);
                    return [4 /*yield*/, index_1.paginate(mockRepository, {
                            limit: 10,
                            page: 1
                        })];
                case 1:
                    results = _a.sent();
                    expect(results).toBeInstanceOf(pagination_1.Pagination);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Item length should be correct', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockRepository, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockRepository = new MockRepository(10);
                    return [4 /*yield*/, index_1.paginate(mockRepository, {
                            limit: 4,
                            page: 1
                        })];
                case 1:
                    results = _a.sent();
                    expect(results.items.length).toBe(4);
                    expect(results.meta.itemCount).toBe(4);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Page count should be correct', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockRepository, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockRepository = new MockRepository(10);
                    return [4 /*yield*/, index_1.paginate(mockRepository, {
                            limit: 4,
                            page: 1
                        })];
                case 1:
                    results = _a.sent();
                    expect(results.meta.totalPages).toBe(3);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Particular page count should be correct', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockRepository, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockRepository = new MockRepository(5);
                    return [4 /*yield*/, index_1.paginate(mockRepository, {
                            limit: 4,
                            page: 1
                        })];
                case 1:
                    results = _a.sent();
                    expect(results.meta.totalPages).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Routes return successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockRepository, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockRepository = new MockRepository(10);
                    return [4 /*yield*/, index_1.paginate(mockRepository, {
                            limit: 4,
                            page: 2,
                            route: 'http://example.com/something'
                        })];
                case 1:
                    results = _a.sent();
                    expect(results.links.first).toBe('http://example.com/something?limit=4');
                    expect(results.links.previous).toBe('http://example.com/something?page=1&limit=4');
                    expect(results.links.next).toBe('http://example.com/something?page=3&limit=4');
                    expect(results.links.last).toBe('http://example.com/something?page=3&limit=4');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Route previous return successfully blank', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockRepository, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockRepository = new MockRepository(10);
                    return [4 /*yield*/, index_1.paginate(mockRepository, {
                            limit: 4,
                            page: 1,
                            route: 'http://example.com/something'
                        })];
                case 1:
                    results = _a.sent();
                    expect(results.links.first).toBe('http://example.com/something?limit=4');
                    expect(results.links.previous).toBe('');
                    expect(results.links.next).toBe('http://example.com/something?page=2&limit=4');
                    expect(results.links.last).toBe('http://example.com/something?page=3&limit=4');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Route next return successfully blank', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockRepository, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockRepository = new MockRepository(10);
                    return [4 /*yield*/, index_1.paginate(mockRepository, {
                            limit: 4,
                            page: 3,
                            route: 'http://example.com/something'
                        })];
                case 1:
                    results = _a.sent();
                    expect(results.links.first).toBe('http://example.com/something?limit=4');
                    expect(results.links.previous).toBe('http://example.com/something?page=2&limit=4');
                    expect(results.links.next).toBe('');
                    expect(results.links.last).toBe('http://example.com/something?page=3&limit=4');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Can pass FindConditions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockRepository, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockRepository = new MockRepository(2);
                    return [4 /*yield*/, index_1.paginate(mockRepository, {
                            limit: 4,
                            page: 1
                        }, {
                            where: {
                                test: 1
                            }
                        })];
                case 1:
                    results = _a.sent();
                    expect(results).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Correctly paginates through the results', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockRepository, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockRepository = new MockRepository(10);
                    return [4 /*yield*/, index_1.paginate(mockRepository, {
                            limit: 4,
                            page: 1
                        })];
                case 1:
                    results = _a.sent();
                    expect(results.meta.itemCount).toBe(4);
                    expect(results.meta.currentPage).toBe(1);
                    expect(results.meta.itemsPerPage).toBe(4);
                    return [4 /*yield*/, index_1.paginate(mockRepository, {
                            limit: 4,
                            page: 2
                        })];
                case 2:
                    // get second page
                    results = _a.sent();
                    expect(results.meta.itemCount).toBe(4);
                    expect(results.meta.currentPage).toBe(2);
                    expect(results.meta.itemsPerPage).toBe(4);
                    return [4 /*yield*/, index_1.paginate(mockRepository, {
                            limit: 4,
                            page: 3
                        })];
                case 3:
                    // get third page
                    results = _a.sent();
                    expect(results.meta.itemCount).toBe(2);
                    expect(results.meta.currentPage).toBe(3);
                    expect(results.meta.itemsPerPage).toBe(4);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Can resolve correct path', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockRepository, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockRepository = new MockRepository(10);
                    return [4 /*yield*/, index_1.paginate(mockRepository, {
                            limit: 4,
                            page: 1,
                            route: '/test?test=test'
                        })];
                case 1:
                    results = _a.sent();
                    expect(results.links.next).toBe('/test?test=test&page=2&limit=4');
                    return [2 /*return*/];
            }
        });
    }); });
    it('when page is 0, return empty pagination object', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockRepository, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockRepository = new MockRepository(10);
                    return [4 /*yield*/, index_1.paginate(mockRepository, {
                            limit: 4,
                            page: 0,
                            route: '/test?test=test'
                        })];
                case 1:
                    results = _a.sent();
                    expect(results.items.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
