import { AsyncMock } from "./AsyncMocker";
import { diff } from "jest-diff";
import deepEqual from 'deep-equal';

const untilCalledWith = async <Return, const Args extends any[]>(
  mock: AsyncMock<Return, Args>,
  expectedArgs: Args,
  maxWaitMs = 100,
) => {

  if (deepEqual(mock.mock.lastCall, expectedArgs)) return;

  const startTime = Date.now();

  while (Date.now() < startTime + maxWaitMs) {
    await new Promise((res) => setTimeout(res, 1));
    if (deepEqual(mock.mock.lastCall, expectedArgs)) return;
  }

  throw new Error(
    `AsyncMock was not called with args
${diff(expectedArgs, mock.mock.lastCall)}`
  )

  // expect(
  //   mock.mock.lastCall,
  //   // eslint-disable-next-line vitest/valid-expect
  //   'Failed waiting for function to be called with args',
  // ).toEqual(expectedArgs);
};

export default untilCalledWith;