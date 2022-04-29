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
	[K in keyof KeyToComponent<Item>]?: ElementHook<KeyToComponent<Item>[K]>;
};

export type ElementHook<TableComponent> = {
	eventHandlers?: Array<EventHandler<TableComponent>>;
};

export type EventHandler<TableComponent> = {
	type: 'click';
	callback: (props: EventProps<MouseEvent, TableComponent>) => void;
};

export type EventProps<EventType, TableComponent> = {
	event: EventType;
	component: TableComponent;
};

export type AggregateTableHooks<Item> = {
	[K in keyof KeyToComponent<Item>]: AggregateElementHook<KeyToComponent<Item>[K]>;
};

export type AggregateElementHook<TableComponent> = {
	eventHandlers: Array<EventHandler<TableComponent>>;
};
