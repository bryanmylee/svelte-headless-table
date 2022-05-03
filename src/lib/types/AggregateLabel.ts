import type { RenderConfig } from '../render';

// If the function types are removed from the union, generics will not be
// inferred for subtypes.
export type AggregateLabel<Item> = RenderConfig | ((data: Item[]) => RenderConfig);
