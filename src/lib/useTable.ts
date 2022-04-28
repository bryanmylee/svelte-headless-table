import { derived, type Readable } from 'svelte/store';
import { BodyRow, getBodyRows } from './bodyRows';
import { getFlatColumns, type Column } from './columns';
import type { HeaderCell } from './headerCells';
import { getHeaderRows, type HeaderRow } from './headerRows';
import { nonNullish } from './utils/filter';
import { Undefined } from './utils/store';

export type UseTableProps<Item> = {
	data: Readable<Array<Item>>;
	columns: Array<Column<Item>>;
};

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

type AggregateTableHooks<Item> = {
	thead: {
		tr: AggregateElementHook<HeaderRow<Item>> & {
			th: AggregateElementHook<HeaderCell<Item>>;
		};
	};
};

type AggregateElementHook<TableComponent> = {
	eventHandlers: Array<EventHandler<TableComponent>>;
};

export const useTable = <Item, P extends Record<string, UseTablePlugin<Item, unknown>>>(
	{ data, columns: rawColumns }: UseTableProps<Item>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	plugins: P = {} as any
) => {
	type PluginStates = { [K in keyof P]: P[K]['state'] };
	const pluginStates = Object.fromEntries(
		Object.entries(plugins).map(([key, plugin]) => [key, plugin.state])
	) as PluginStates;

	const sortFns = Object.values(plugins)
		.map((plugin) => plugin.sortFn)
		.filter(nonNullish);

	const aggregateHooks: AggregateTableHooks<Item> = {
		thead: {
			tr: {
				eventHandlers: [],
				th: {
					eventHandlers: [],
				},
			},
		},
	};
	Object.values(plugins).forEach(({ hooks }) => {
		if (hooks === undefined) return;
		const { thead } = hooks;
		if (thead !== undefined) {
			const { tr } = thead;
			if (tr !== undefined) {
				if (tr.eventHandler !== undefined) {
					aggregateHooks.thead.tr.eventHandlers.push(tr.eventHandler);
				}
				const { th } = tr;
				if (th !== undefined) {
					if (th.eventHandler !== undefined) {
						aggregateHooks.thead.tr.th.eventHandlers.push(th.eventHandler);
					}
				}
			}
		}
	});

	const columnOrder = Undefined;
	const hiddenColumns = Undefined;

	const flatColumns = derived([columnOrder, hiddenColumns], ([$columnOrder, $hiddenColumns]) => {
		return getFlatColumns(rawColumns, {
			columnOrder: $columnOrder,
			hiddenColumns: $hiddenColumns,
		});
	});
	const headerRows = derived([columnOrder, hiddenColumns], ([$columnOrder, $hiddenColumns]) => {
		return getHeaderRows(rawColumns, {
			columnOrder: $columnOrder,
			hiddenColumns: $hiddenColumns,
		});
	});

	const originalBodyRows = derived([data, flatColumns], ([$data, $flatColumns]) => {
		return getBodyRows($data, $flatColumns);
	});
	const bodyRows = derived([originalBodyRows, ...sortFns], ([$originalBodyRows, ...$sortFns]) => {
		const sortedRows = [...$originalBodyRows];
		$sortFns.forEach((sortFn) => {
			sortedRows.sort(sortFn);
		});
		return sortedRows;
	});

	return {
		flatColumns,
		headerRows,
		bodyRows,
		plugins: pluginStates,
	};
};
