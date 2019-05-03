import {createAsyncMock, spyOnAsync} from './index';

describe('spyOnAsync', () => {
  let underlyingImplementation;
  let objectToSpyOn;

  beforeEach(() => {
    underlyingImplementation = jest.fn();
    objectToSpyOn = {
      someMethod: (...args) => underlyingImplementation(...args)
    };

    spyOnAsync(objectToSpyOn, 'someMethod');
  });

  it('does not call the underlying implementation', () => {
    objectToSpyOn.someMethod();

    expect(underlyingImplementation).not.toHaveBeenCalled();
  });

  it('returns a promise that can be resolved through the method', async () => {
    let result;
    let error;

    objectToSpyOn.someMethod()
      .then(res => result = res)
      .catch(err => error = err);

    expect(result).toBeUndefined();
    expect(error).toBeUndefined();

    await objectToSpyOn.someMethod.mock.resolve('result');

    expect(result).toEqual('result');
    expect(error).toEqual(undefined);
  });

  it('returns a promise that can be rejected through the method', async () => {
    let result;
    let error;

    objectToSpyOn.someMethod()
      .then(res => result = res)
      .catch(err => error = err);

    expect(result).toBeUndefined();
    expect(error).toBeUndefined();

    await objectToSpyOn.someMethod.mock.reject('error');

    expect(result).toEqual(undefined);
    expect(error).toEqual('error');

  });

  it('can be asserted on like a real spy', () => {
    objectToSpyOn.someMethod('someArg');

    expect(objectToSpyOn.someMethod).toHaveBeenCalledWith('someArg')
  });

  describe('when mock is called more than once', () => {
    it('each resolve resolves the next promise', async () => {
      let firstCallResult;
      let firstCallError;

      objectToSpyOn.someMethod()
        .then(res => firstCallResult = res)
        .catch(err => firstCallError = err);

      let secondCallResult;
      let secondCallError;

      objectToSpyOn.someMethod()
        .then(res => secondCallResult = res)
        .catch(err => secondCallError = err);

      expect(firstCallResult).toEqual(undefined);
      expect(secondCallResult).toEqual(undefined);

      await objectToSpyOn.someMethod.mock.resolve('an important part of a balanced breakfast');

      expect(firstCallResult).toEqual('an important part of a balanced breakfast');
      expect(secondCallResult).toEqual(undefined);

      await objectToSpyOn.someMethod.mock.resolve('good for your toes');

      expect(firstCallResult).toEqual('an important part of a balanced breakfast');
      expect(secondCallResult).toEqual('good for your toes');
    });
  });
});

describe('createAsyncMock', () => {
  describe('when mock is called once', () => {
    describe('when resolve is called', () => {
      it('resolves the promise with given value', async () => {
        const {mock, resolve, reject} = createAsyncMock();

        let resolvedVal;

        mock().then(val => {
          resolvedVal = val
        });

        await resolve('hello darkness');

        expect(resolvedVal).toEqual('hello darkness')
      });

      it('returns the same promise so you can await it', () => {
        const {mock, resolve, reject} = createAsyncMock();

        const promiseFromMock = mock();

        const promiseFromResolve = resolve();

        expect(promiseFromMock).toEqual(promiseFromResolve);
      });
    });

    describe('when reject is called', () => {
      it('rejects the promise with given value', async () => {
        const {mock, resolve, reject} = createAsyncMock();

        let rejectedError;

        mock().catch(e => {
          rejectedError = e
        });

        const error = new Error('you have crossed me for the last time');

        await reject(error);

        expect(rejectedError).toEqual(error)
      });

      it('returns the same promise so you can await it', () => {
        const {mock, resolve, reject} = createAsyncMock();

        const promiseFromMock = mock();

        const promiseFromReject = reject();

        expect(promiseFromMock).toEqual(promiseFromReject);
      });
    });
  });
});