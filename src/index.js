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
    mock: jest.fn().mockReturnValue(promise)
  };
};

export const spyOnAsync = (module, methodName) => {
  let asyncMocks = [];
  jest.spyOn(module, methodName).mockImplementation((...args) => {
    const asyncMock = createAsyncMock();
    asyncMocks = [asyncMock, ...asyncMocks];
    return asyncMock.mock(...args)
  });
  module[methodName].mock.resolve = (val) => {
    const asyncMock = asyncMocks.pop();

    return asyncMock.resolve(val);
  };
  module[methodName].mock.reject = (err) => {
    const asyncMock = asyncMocks.pop();

    return asyncMock.reject(err);
  };
};