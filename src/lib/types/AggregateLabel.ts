import type { Writable } from 'svelte/store';
import type { RenderConfig } from '../render';

// If the function type is removed from the union, generics will not be
// inferred for subtypes.
export type AggregateLabel<Item> =
	| RenderConfig
	| ((props: AggregateLabelProps<Item>) => RenderConfig);

export interface AggregateLabelProps<Item> {
	data: Writable<Item[]>;
}
