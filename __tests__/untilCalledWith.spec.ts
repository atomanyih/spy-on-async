import untilCalledWith from '../src/untilCalledWith';
import { createAsyncMock } from '../src';

describe('untilCalledWith', () => {
  it('does not resolve until async mock is called with args', async () => {
    let isResolved = false;

    const asyncMock = createAsyncMock();

    untilCalledWith(asyncMock, ['right arg']).then(() => (isResolved = true));

    expect(isResolved).toBe(false);

    asyncMock('wrong arg');
    await new Promise((res) => setTimeout(res, 1));

    expect(isResolved).toBe(false);

    asyncMock('right arg');
    await new Promise((res) => setTimeout(res, 1));

    expect(isResolved).toBe(true);
  });

  it('gives up after timeout, printing diff with last call', async () => {
    let error: Error;

    const asyncMock = createAsyncMock();

    untilCalledWith(asyncMock, ['right arg']).catch((e) => (error = e));

    expect(error).toBeUndefined();

    asyncMock('wrong arg');
    await new Promise((res) => setTimeout(res, 1));
    expect(error).toBeUndefined();

    asyncMock('wrong arg 2');
    await new Promise((res) => setTimeout(res, 100));

    expect(error.message).toEqual(`AsyncMock was not called with args
[32m- Expected[39m
[31m+ Received[39m

[2m  Array [[22m
[32m-   "right arg",[39m
[31m+   "wrong arg 2",[39m
[2m  ][22m`);
  });
});
