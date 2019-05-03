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

  xdescribe('when mock is called more than once', () => {
    it('resolves all promises when resolve is called', async () => {
      const {mock, resolve, reject} = createAsyncMock();

      let firstResult;
      let secondResult;

      mock().then(val => {
        firstResult = val
      });

      mock().then(val => {
        secondResult = val
      });

      await resolve('an important part of a healthy breakfast');

      expect(firstResult).toEqual('an important part of a healthy breakfast')
      expect(secondResult).toEqual('an important part of a healthy breakfast')
    });

    it('can resolve individual promises', () => {
      const {mock, resolve, reject} = createAsyncMock();

      let firstResult;
      let secondResult;

      mock().then(val => {
        firstResult = val
      });

      mock().then(val => {
        secondResult = val
      });

      mock.promises[0].resolve('i am the first');
      mock.promises[1].resolve('i tried to be first');

      expect(firstResult).toEqual('i am the first');
      expect(secondResult).toEqual('i tried to be first');
    });
  });
});