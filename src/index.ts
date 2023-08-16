import mocker from './AsyncMocker';

export { AsyncMock, AsyncSpy } from './AsyncMocker';

export { default as untilCalledWith } from './untilCalledWith';

export const createAsyncMock = mocker.createAsyncMock;
export const spyOnAsync = mocker.spyOnAsync;
export const resetAllPromises = mocker.resetAllPromises;
