import type { TableState } from '$lib/createViewModel';
import type { RenderConfig } from '$lib/render';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Label<Item, Value> = (value: Value) => RenderConfig;

// If the function type is removed from the union, generics will not be
// inferred for subtypes.
export type HeaderLabel<Item> = RenderConfig | ((props: TableState<Item>) => RenderConfig);
