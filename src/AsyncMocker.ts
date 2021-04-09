// import ArgsType = jest.ArgsType;

export interface AsyncMock<ResolveType = any, ArgsType extends any[] = any>
  extends Function,
    jest.Mock<Promise<ResolveType>, ArgsType> {
  mockResolveNext(val: ResolveType): Promise<ResolveType>;

  mockRejectNext(val?: any): Promise<any>;
}

export interface AsyncSpy<ResolveType, ArgsType extends any[] = any>
  extends jest.SpyInstance<Promise<ResolveType>, ArgsType> {
  mockResolveNext(val: ResolveType): Promise<ResolveType>;

  mockRejectNext(val?: any): Promise<any>;
}

type AsyncMockCall<ResolveType, ArgsType extends any[]> = {
  resolve(val?: ResolveType): Promise<ResolveType>;
  reject(val?: any): Promise<any>;
  call(...args: ArgsType): Promise<ResolveType>; // call
  reset(): void; // reset
};

const createMockCall = <ResolveType, ArgsType extends any[]>(): AsyncMockCall<
  ResolveType,
  ArgsType
> => {
  let resolvePromise: (value?: ResolveType | PromiseLike<ResolveType>) => void;
  let rejectPromise: (reason?: any) => void;
  let promise: Promise<ResolveType>;

  function resetPromise() {
    promise = new Promise<ResolveType>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
  }

  resetPromise();

  return {
    resolve(val?: ResolveType) {
      resolvePromise(val);

      return promise;
    },
    reject(val?: any) {
      rejectPromise(val);

      return promise.catch(() => val);
    },
    call: () => promise,
    reset: resetPromise,
  };
};

const multipleCalls = <ResolveType, ArgsType extends any[]>(
  createMockImplementation: () => AsyncMockCall<ResolveType, ArgsType>
) => (): AsyncMockCall<ResolveType, ArgsType> => {
  let calls: AsyncMockCall<ResolveType, ArgsType>[] = [];

  return {
    resolve(val?: ResolveType) {
      const call = calls.pop();
      if (!call) {
        throw new Error('Async Mock has not been called');
      }

      return call.resolve(val);
    },
    reject(val?: any) {
      const call = calls.pop();
      if (!call) {
        throw new Error('Async Mock has not been called');
      }

      return call.reject(val);
    },
    call: (...args) => {
      const call = createMockImplementation();
      calls.unshift(call);

      return call.call(...args);
    },
    reset: () => {
      calls = [];
    },
  };
};

class AsyncMocker {
  private _resetRegistry: Set<() => void>;

  constructor() {
    this._resetRegistry = new Set();
  }

  resetAllPromises = () => {
    this._resetRegistry.forEach((reset) => reset());
  };

  createAsyncMock = <ResolveType, ArgsType extends any[] = any>(): AsyncMock<
    ResolveType,
    ArgsType
  > => {
    const { call, resolve, reject, reset } = multipleCalls<
      ResolveType,
      ArgsType
    >(createMockCall)();

    this._resetRegistry.add(reset);

    const fn = Object.assign(jest.fn(), {
      mockResolveNext: resolve,
      mockRejectNext: reject,
    });

    fn.mockImplementation(call);

    return fn;
  };

  createAsyncMockSingleton = <ResolveType, ArgsType extends any[]>(): AsyncMock<
    ResolveType,
    ArgsType
  > => {
    const { call, resolve, reject, reset } = createMockCall<
      ResolveType,
      ArgsType
    >();

    this._resetRegistry.add(reset);

    const fn = Object.assign(jest.fn(), {
      mockResolveNext: resolve,
      mockRejectNext: reject,
    });

    fn.mockImplementation(call);

    return fn;
  };

  // TODO: how to type `module`?
  // typings in jest look cray
  spyOnAsync = <ResolveType, ArgsType extends any[]>(
    module: any,
    methodName: string
  ): AsyncSpy<ResolveType> => {
    const { call, resolve, reject, reset } = multipleCalls<
      ResolveType,
      ArgsType
    >(createMockCall)();

    this._resetRegistry.add(reset);

    const fn = jest.spyOn(module, methodName).mockImplementation(call);

    return Object.assign(fn, {
      mockResolveNext: resolve,
      mockRejectNext: reject,
    });
  };
}

const mocker = new AsyncMocker();

export default mocker;
