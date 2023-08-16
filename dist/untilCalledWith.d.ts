import { AsyncMock } from "./AsyncMocker";
declare const untilCalledWith: <Return, const Args extends any[]>(mock: AsyncMock<Return, Args>, expectedArgs: Args, maxWaitMs?: number) => Promise<void>;
export default untilCalledWith;
