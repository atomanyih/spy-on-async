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
  const {mock, resolve, reject} = createAsyncMock();
  jest.spyOn(module, methodName).mockImplementation(mock);
  module[methodName].mock.resolve = resolve;
  module[methodName].mock.reject = reject;
};