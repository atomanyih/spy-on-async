/// <reference types="jest" />
export interface AsyncMock<T> extends jest.Mock<Promise<T>> {
    mockResolveNext(val: T): Promise<T>;
    mockRejectNext(val?: T): Promise<any>;
}
export interface AsyncSpy<T> extends jest.SpyInstance<Promise<T>> {
    mockResolveNext(val: T): Promise<T>;
    mockRejectNext(val?: T): Promise<any>;
}
declare class AsyncMocker {
    private _resetRegistry;
    constructor();
    resetAllPromises: () => void;
    createAsyncMock: <T>() => AsyncMock<T>;
    createAsyncMockSingleton: <T>() => AsyncMock<T>;
    spyOnAsync: <ReturnType_1>(module: any, methodName: string) => AsyncSpy<ReturnType_1>;
}
declare const mocker: AsyncMocker;
export default mocker;
