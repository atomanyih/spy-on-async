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
            return promise["catch"](function () { return val; });
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

var createAsyncMock = mocker.createAsyncMock;
var spyOnAsync = mocker.spyOnAsync;
var resetAllPromises = mocker.resetAllPromises;

export { createAsyncMock, resetAllPromises, spyOnAsync };
