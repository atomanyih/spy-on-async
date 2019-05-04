export const createAsyncMock = () => {
  let resolvePromise, rejectPromise;

  const promise = new Promise((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  return {
    resolve(val) {
      resolvePromise(val);

      return promise;
    },
    reject(val) {
      rejectPromise(val);

      return promise.catch(() => {
      });
    },
    mock: () => promise
  };
};

const multiple = (createAsyncMock) => () => {
  let asyncMocks = [];
  const mock = (...args) => {
    const asyncMock = createAsyncMock();
    asyncMocks = [asyncMock, ...asyncMocks];
    return asyncMock.mock(...args)
  };
  const resolve = (val) => {
    const asyncMock = asyncMocks.pop();

    return asyncMock.resolve(val);
  };
  const reject = (err) => {
    const asyncMock = asyncMocks.pop();

    return asyncMock.reject(err);
  };

  return {mock, resolve, reject}
};

export const createAsyncSpy = () => {
  const {mock, resolve, reject} = multiple(createAsyncMock)();

  const fn = jest.fn();

  fn.mockImplementation(mock);
  fn.mock.resolve = resolve;
  fn.mock.reject = reject;

  return fn
};

export const spyOnAsync = (module, methodName) => {
  const {mock, resolve, reject} = multiple(createAsyncMock)();
  jest.spyOn(module, methodName).mockImplementation(mock);
  module[methodName].mock.resolve = resolve;
  module[methodName].mock.reject = reject;
};