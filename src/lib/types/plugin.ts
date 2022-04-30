import type { BodyRow } from '$lib/bodyRows';
import type { HeaderCell } from '$lib/headerCells';
import type { HeaderRow } from '$lib/headerRows';
import type { Readable } from 'svelte/store';

export type UseTablePlugin<Item, PluginState> = {
	state: PluginState;
	sortFn?: Readable<(a: BodyRow<Item>, b: BodyRow<Item>) => number>;
	hooks?: TableHooks<Item>;
};

export type KeyToComponent<Item> = {
	'thead.tr': HeaderRow<Item>;
	'thead.tr.th': HeaderCell<Item>;
};

export type TableHooks<Item> = {
	[K in keyof KeyToComponent<Item>]?: (component: KeyToComponent<Item>[K]) => ElementHook;
};

export type ElementHook = {
	eventHandlers?: Array<EventHandler>;
};

export type EventHandler = {
	type: 'click';
	callback: (event: MouseEvent) => void;
};
