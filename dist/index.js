'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jestDiff = require('jest-diff');
var deepEqual = require('deep-equal');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var deepEqual__default = /*#__PURE__*/_interopDefaultLegacy(deepEqual);

// import ArgsType = jest.ArgsType;
var createMockCall = function () {
    var resolvePromise;
    var rejectPromise;
    var promise;
    function resetPromise() {
        promise = new Promise(function (resolve, reject) {
            resolvePromise = resolve;
            rejectPromise = reject;
        });
    }
    resetPromise();
    return {
        resolve: function (val) {
            resolvePromise(val);
            return promise;
        },
        reject: function (val) {
            rejectPromise(val);
            return promise.catch(function () { return val; });
        },
        call: function () { return promise; },
        reset: resetPromise,
    };
};
var multipleCalls = function (createMockImplementation) { return function () {
    var calls = [];
    return {
        resolve: function (val) {
            var call = calls.pop();
            if (!call) {
                throw new Error('Async Mock has not been called');
            }
            return call.resolve(val);
        },
        reject: function (val) {
            var call = calls.pop();
            if (!call) {
                throw new Error('Async Mock has not been called');
            }
            return call.reject(val);
        },
        call: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var call = createMockImplementation();
            calls.unshift(call);
            return call.call.apply(call, args);
        },
        reset: function () {
            calls = [];
        },
    };
}; };
var AsyncMocker = /** @class */ (function () {
    function AsyncMocker() {
        var _this = this;
        this.resetAllPromises = function () {
            _this._resetRegistry.forEach(function (reset) { return reset(); });
        };
        this.createAsyncMock = function () {
            var _a = multipleCalls(createMockCall)(), call = _a.call, resolve = _a.resolve, reject = _a.reject, reset = _a.reset;
            _this._resetRegistry.add(reset);
            var fn = Object.assign(jest.fn(), {
                mockResolveNext: resolve,
                mockRejectNext: reject,
            });
            fn.mockImplementation(call);
            return fn;
        };
        this.createAsyncMockSingleton = function () {
            var _a = createMockCall(), call = _a.call, resolve = _a.resolve, reject = _a.reject, reset = _a.reset;
            _this._resetRegistry.add(reset);
            var fn = Object.assign(jest.fn(), {
                mockResolveNext: resolve,
                mockRejectNext: reject,
            });
            fn.mockImplementation(call);
            return fn;
        };
        // TODO: how to type `module`?
        // typings in jest look cray
        this.spyOnAsync = function (module, methodName) {
            var _a = multipleCalls(createMockCall)(), call = _a.call, resolve = _a.resolve, reject = _a.reject, reset = _a.reset;
            _this._resetRegistry.add(reset);
            var fn = jest.spyOn(module, methodName).mockImplementation(call);
            return Object.assign(fn, {
                mockResolveNext: resolve,
                mockRejectNext: reject,
            });
        };
        this._resetRegistry = new Set();
    }
    return AsyncMocker;
}());
var mocker = new AsyncMocker();

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

var untilCalledWith = function (mock, expectedArgs, maxWaitMs) {
    if (maxWaitMs === void 0) { maxWaitMs = 100; }
    return __awaiter(void 0, void 0, void 0, function () {
        var startTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (deepEqual__default["default"](mock.mock.lastCall, expectedArgs))
                        return [2 /*return*/];
                    startTime = Date.now();
                    _a.label = 1;
                case 1:
                    if (!(Date.now() < startTime + maxWaitMs)) return [3 /*break*/, 3];
                    return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 1); })];
                case 2:
                    _a.sent();
                    if (deepEqual__default["default"](mock.mock.lastCall, expectedArgs))
                        return [2 /*return*/];
                    return [3 /*break*/, 1];
                case 3: throw new Error("AsyncMock was not called with args\n".concat(jestDiff.diff(expectedArgs, mock.mock.lastCall)));
            }
        });
    });
};

var createAsyncMock = mocker.createAsyncMock;
var spyOnAsync = mocker.spyOnAsync;
var resetAllPromises = mocker.resetAllPromises;

exports.createAsyncMock = createAsyncMock;
exports.resetAllPromises = resetAllPromises;
exports.spyOnAsync = spyOnAsync;
exports.untilCalledWith = untilCalledWith;
