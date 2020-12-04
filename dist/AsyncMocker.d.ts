/// <reference types="jest" />
export interface AsyncMock<ResolveType = any, ArgsType extends any[] = any> extends Function, jest.Mock<Promise<ResolveType>, ArgsType> {
    mockResolveNext(val: ResolveType): Promise<ResolveType>;
    mockRejectNext(val?: any): Promise<any>;
}
export interface AsyncSpy<ResolveType, ArgsType extends any[] = any> extends jest.SpyInstance<Promise<ResolveType>, ArgsType> {
    mockResolveNext(val: ResolveType): Promise<ResolveType>;
    mockRejectNext(val?: any): Promise<any>;
}
declare class AsyncMocker {
    private _resetRegistry;
    constructor();
    resetAllPromises: () => void;
    createAsyncMock: <ResolveType>() => AsyncMock<ResolveType, any>;
    createAsyncMockSingleton: <ResolveType>() => AsyncMock<ResolveType, any>;
    spyOnAsync: <ResolveType>(module: any, methodName: string) => AsyncSpy<ResolveType, any>;
}
declare const mocker: AsyncMocker;
export default mocker;
