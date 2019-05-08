import {createAsyncMock, spyOnAsync} from '../src/index';
import fakeAsyncFunction from './fakeAsyncFunction';
import FakeAsyncModule from "./FakeAsyncModule";

jest.mock('./fakeAsyncFunction', () => require('../src/index').createAsyncSpy());
jest.mock('./FakeAsyncModule', () => ({
  someAsyncAction: require('../src/index').createAsyncSpy()
}));

describe('createAsyncSpy', () => {
  it('can be used with jest.mock()', async () => {
    let firstCallResult;
    let firstCallError;

    fakeAsyncFunction()
      .then(res => firstCallResult = res)
      .catch(err => firstCallError = err);

    let secondCallResult;
    let secondCallError;

    fakeAsyncFunction()
      .then(res => secondCallResult = res)
      .catch(err => secondCallError = err);

    expect(firstCallResult).toEqual(undefined);
    expect(secondCallResult).toEqual(undefined);

    await fakeAsyncFunction.mock.resolve('an important part of a balanced breakfast');

    expect(firstCallResult).toEqual('an important part of a balanced breakfast');
    expect(secondCallResult).toEqual(undefined);

    await fakeAsyncFunction.mock.resolve('good for your toes');

    expect(firstCallResult).toEqual('an important part of a balanced breakfast');
    expect(secondCallResult).toEqual('good for your toes');
  });

  it('can be used with jest.mock()', async () => {
    let firstCallResult;
    let firstCallError;

    FakeAsyncModule.someAsyncAction()
      .then(res => firstCallResult = res)
      .catch(err => firstCallError = err);

    let secondCallResult;
    let secondCallError;

    FakeAsyncModule.someAsyncAction()
      .then(res => secondCallResult = res)
      .catch(err => secondCallError = err);

    expect(firstCallResult).toEqual(undefined);
    expect(secondCallResult).toEqual(undefined);

    await FakeAsyncModule.someAsyncAction.mock.resolve('an important part of a balanced breakfast');

    expect(firstCallResult).toEqual('an important part of a balanced breakfast');
    expect(secondCallResult).toEqual(undefined);

    await FakeAsyncModule.someAsyncAction.mock.resolve('good for your toes');

    expect(firstCallResult).toEqual('an important part of a balanced breakfast');
    expect(secondCallResult).toEqual('good for your toes');
  });
});

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

  // if promise is resolved before called
  // it resolves when called
  // if you await it
  // it resolves when called
  // how to test this: async iterator? coroutine type thing?
  // promise.all?

  describe('when promise is resolved before it is called', () => {
    it('should resolve when called', async () => {
      let firstCallResult;
      let firstCallError;
      let secondCallResult;
      let secondCallError;

      const methodUnderTest = async () => {
        await objectToSpyOn.someMethod('call1')
          .then(res => firstCallResult = res)
          .catch(err => firstCallError = err);

        await objectToSpyOn.someMethod('call2')
          .then(res => secondCallResult = res)
          .catch(err => secondCallError = err);
      };

      const promise = (async () => {
        await objectToSpyOn.someMethod.mock.resolve('an important part of a balanced breakfast')
        expect(objectToSpyOn.someMethod).toHaveBeenCalledWith('call1');

        await objectToSpyOn.someMethod.mock.resolve('WHAT IS THIS');
        expect(objectToSpyOn.someMethod).toHaveBeenCalledWith('call2');
      })();

      methodUnderTest();
      await promise;

      expect(firstCallError).toBeUndefined();
      expect(firstCallResult).toEqual('an important part of a balanced breakfast');
    });
  });

  describe('when promise is rejected before it is called', () => {
    it('should reject when called', async () => {
      let firstCallResult;
      let firstCallError;

      const resolvePromise = objectToSpyOn.someMethod.mock.reject('an important part of a balanced breakfast');

      const callPromise = objectToSpyOn.someMethod()
        .then(res => firstCallResult = res)
        .catch(err => firstCallError = err);

      await Promise.all([
        resolvePromise,
        callPromise
      ]);

      expect(firstCallError).toEqual('an important part of a balanced breakfast');
      expect(firstCallResult).toBeUndefined();
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