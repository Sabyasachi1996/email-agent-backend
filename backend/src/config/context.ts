import { AsyncLocalStorage } from "async_hooks";
export const reqContext = new AsyncLocalStorage<Map<string,any>>();