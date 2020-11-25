export { AsyncMock, AsyncSpy } from './AsyncMocker';
export declare const createAsyncMock: <T>() => import("./AsyncMocker").AsyncMock<T>;
export declare const spyOnAsync: <ReturnType_1>(module: any, methodName: string) => import("./AsyncMocker").AsyncSpy<ReturnType_1>;
export declare const resetAllPromises: () => void;
