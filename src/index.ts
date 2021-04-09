import mocker from './AsyncMocker';

export { AsyncMock, AsyncSpy } from './AsyncMocker';

export const createAsyncMock = mocker.createAsyncMock;
export const spyOnAsync = mocker.spyOnAsync;
export const resetAllPromises = mocker.resetAllPromises;
