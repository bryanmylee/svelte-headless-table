import type { UseTableState } from '$lib/useTable';
import type { RenderConfig } from '../render';

// If the function type is removed from the union, generics will not be
// inferred for subtypes.
export type AggregateLabel<Item> = RenderConfig | ((props: UseTableState<Item>) => RenderConfig);
