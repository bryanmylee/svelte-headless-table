import type { BodyRow } from '$lib/bodyRows';
import type { HeaderCell } from '$lib/headerCells';
import type { HeaderRow } from '$lib/headerRows';
import type { Readable } from 'svelte/store';

export type UseTablePlugin<Item, PluginState> = {
	state: PluginState;
	sortFn?: Readable<(a: BodyRow<Item>, b: BodyRow<Item>) => number>;
	hooks?: TableHooks<Item>;
};

export type TableHooks<Item> = {
	thead?: {
		tr?: ElementHook<HeaderRow<Item>> & {
			th?: ElementHook<HeaderCell<Item>>;
		};
	};
};

export type ElementHook<TableComponent> = {
	eventHandler?: EventHandler<TableComponent>;
};

export type EventHandler<TableComponent> = (props: EventProps<TableComponent>) => void;

export type EventProps<TableComponent> = {
	type: 'click';
	event: MouseEvent;
	component: TableComponent;
};

export type AggregateTableHooks<Item> = {
	thead: {
		tr: AggregateElementHook<HeaderRow<Item>> & {
			th: AggregateElementHook<HeaderCell<Item>>;
		};
	};
};

export type AggregateElementHook<TableComponent> = {
	eventHandlers: Array<EventHandler<TableComponent>>;
};
