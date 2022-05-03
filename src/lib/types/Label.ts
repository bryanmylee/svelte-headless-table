import type { RenderConfig } from '../render';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Label<Item, Value> = (value: Value) => RenderConfig;
