import { derived, type Readable } from 'svelte/store';
import { getBodyRows, getSortedBodyRows } from './bodyRows';
import { getFlatColumns, type Column } from './columns';
import type { HeaderCell } from './headerCells';
import { getHeaderRows, type HeaderRow } from './headerRows';
import type { ColumnFilter, ColumnOrder, SortOn } from './types/config';
import { Undefined } from './utils/store';

export type UseTableConfig<Item> = ColumnOrder<Item> & ColumnFilter<Item> & SortOn<Item>;

export type UseTableProps<Item> = {
	data: Readable<Array<Item>>;
	columns: Array<Column<Item>>;
};

export type UseTablePlugin<Item, PluginState> = {
	state?: PluginState;
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

export const useTable = <Item, Plugins extends Array<UseTablePlugin<Item, unknown>> = []>(
	{ data, columns: rawColumns }: UseTableProps<Item>,
	...plugins: Plugins
) => {
	const columnOrder = Undefined;
	const hiddenColumns = Undefined;
	const sortKeys = Undefined;
	const flatColumns = derived([columnOrder, hiddenColumns], ([$columnOrder, $hiddenColumns]) => {
		return getFlatColumns(rawColumns, { columnOrder: $columnOrder, hiddenColumns: $hiddenColumns });
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
	return {
		flatColumns,
		headerRows,
		bodyRows,
	};
};
