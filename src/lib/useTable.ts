import { derived, type Readable } from 'svelte/store';
import { BodyRow, getBodyRows, getSortedBodyRows } from './bodyRows';
import { DataColumn, getFlatColumns, type Column } from './columns';
import type { HeaderCell } from './headerCells';
import { getHeaderRows, type HeaderRow } from './headerRows';
import type { ColumnFilter, ColumnOrder, SortOn } from './types/config';
import { Undefined } from './utils/store';

export type UseTableConfig<Item> = ColumnOrder<Item> & ColumnFilter<Item> & SortOn<Item>;

export type UseTableProps<Item> = {
	data: Readable<Array<Item>>;
	columns: Array<Column<Item>>;
};

type Plugins<Item> = Record<string, UseTablePlugin<Item, unknown>>;

export type UseTablePlugin<Item, PluginState> = {
	state: PluginState;
	sortFn?: Readable<(a: BodyRow<Item>, b: BodyRow<Item>) => number>;
	hooks?: {
		thead?: {
			tr?: ElementHook<HeaderRow<Item>> & {
				th?: ElementHook<HeaderCell<Item>>;
			};
		};
	};
};

export interface ElementHook<TableComponent> {
	eventHandlers?: Array<EventHandler<TableComponent>>;
}

export type EventHandler<TableComponent> = (props: EventProps<TableComponent>) => void;

export interface EventProps<TableComponent> {
	type: 'click';
	event: MouseEvent;
	component: TableComponent;
}

export interface UseTable<Item> {
	flatColumns: Readable<DataColumn<Item>>;
	headerRows: Readable<Array<HeaderRow<Item>>>;
	bodyRows: Readable<Array<BodyRow<Item>>>;
}

export const useTable = <Item, P extends Plugins<Item>>(
	{ data, columns: rawColumns }: UseTableProps<Item>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	pluginConfigs: P = {} as any
) => {
	const columnOrder = Undefined;
	const hiddenColumns = Undefined;
	const sortKeys = Undefined;

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
	const bodyRows = derived([originalBodyRows, sortKeys], ([$originalBodyRows, $sortKeys]) => {
		if ($sortKeys === undefined) {
			return $originalBodyRows;
		}
		return getSortedBodyRows($originalBodyRows, $sortKeys);
	});

	type PluginStates = { [K in keyof P]: P[K]['state'] };
	const plugins = Object.fromEntries(
		Object.entries(pluginConfigs).map(([key, plugin]) => [key, plugin.state])
	) as PluginStates;

	return {
		flatColumns,
		headerRows,
		bodyRows,
		plugins,
	};
};
