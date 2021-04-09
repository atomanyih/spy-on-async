export { AsyncMock, AsyncSpy } from './AsyncMocker';
export declare const createAsyncMock: <ResolveType, ArgsType extends any[] = any>() => import("./AsyncMocker").AsyncMock<ResolveType, ArgsType>;
export declare const spyOnAsync: <ResolveType, ArgsType extends any[]>(module: any, methodName: string) => import("./AsyncMocker").AsyncSpy<ResolveType, any>;
export declare const resetAllPromises: () => void;
