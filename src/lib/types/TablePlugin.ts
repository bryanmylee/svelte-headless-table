import type { Readable } from 'svelte/store';

export interface TablePlugin<Item extends object, PluginState = unknown> {
	sortFn?: Readable<(a: Item, b: Item) => number>;
	state: PluginState;
}
