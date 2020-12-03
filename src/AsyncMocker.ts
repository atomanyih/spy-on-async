export interface AsyncMock<ResolveType = any, ArgsType extends any[] = any> extends Function, jest.Mock<Promise<ResolveType>, ArgsType> {
  mockResolveNext(val: ResolveType): Promise<ResolveType>;
  mockRejectNext(val?: any): Promise<any>;
}

export interface AsyncSpy<ResolveType, ArgsType extends any[] = any> extends jest.SpyInstance<Promise<ResolveType>, ArgsType> {
  mockResolveNext(val: ResolveType): Promise<ResolveType>;
  mockRejectNext(val?: any): Promise<any>;
}

type AsyncMockCall<ResolveType> = {
  resolve(val?: ResolveType) : Promise<ResolveType>;
  reject(val?: any): Promise<any>;
  call(): Promise<ResolveType>; // call
  reset(): void; // reset
}

const createMockCall = <ResolveType>() : AsyncMockCall<ResolveType> => {
  let resolvePromise: (value?: ResolveType | PromiseLike<ResolveType>) => void;
  let rejectPromise: (reason?: any) => void;
  let promise : Promise<ResolveType>;

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
    reset: resetPromise
  };
};

const multipleCalls = <ResolveType>(createMockImplementation: <T>() => AsyncMockCall<T>) => () : AsyncMockCall<ResolveType> => {
  let calls : AsyncMockCall<ResolveType>[] = []

  return {
    resolve(val?: ResolveType) {
      const call = calls.pop();
      if(!call) {
        throw 'No calls yo'
      }

      return call.resolve(val);
    },
    reject(val?: any) {
      const call = calls.pop();
      if(!call) {
        throw 'No calls yo'
      }

      return call.reject(val);
    },
    call: () => {
      const call = createMockImplementation<ResolveType>();
      calls.unshift(call)

      return call.call()
    },
    reset: () => {
      calls = []
    }
  }
}

class AsyncMocker {
  private _resetRegistry:  Set<() => void>;

  constructor() {
    this._resetRegistry = new Set();
  }

  resetAllPromises = () => {
    this._resetRegistry.forEach(reset => reset());
  }

  createAsyncMock = <ResolveType>(): AsyncMock<ResolveType> => {
    const {call, resolve, reject, reset} = multipleCalls<ResolveType>(createMockCall)()

    this._resetRegistry.add(reset)

    const fn = Object.assign(jest.fn(), {
      mockResolveNext: resolve,
      mockRejectNext: reject
    });

    fn.mockImplementation(call)

    return fn;
  }

  createAsyncMockSingleton = <ResolveType>(): AsyncMock<ResolveType> => {
    const {call, resolve, reject, reset} = createMockCall<ResolveType>()

    this._resetRegistry.add(reset)

    const fn = Object.assign(jest.fn(), {
      mockResolveNext: resolve,
      mockRejectNext: reject
    });

    fn.mockImplementation(call)

    return fn;
  }

  // TODO: how to type `module`?
  // typings in jest look cray
  spyOnAsync = <ResolveType>(module: any, methodName: string): AsyncSpy<ResolveType> => {
    const {call, resolve, reject, reset} = multipleCalls<ResolveType>(createMockCall)()

    this._resetRegistry.add(reset)

    const fn = jest.spyOn(module, methodName).mockImplementation(call)

    return Object.assign(fn, {
      mockResolveNext: resolve,
      mockRejectNext: reject
    });
  }
}

const mocker = new AsyncMocker();

export default mocker;