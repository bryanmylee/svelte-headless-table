import { derived, readable, type Readable } from 'svelte/store';
import { getBodyRows, getSortedBodyRows } from './bodyRows';
import { getFlatColumns, type Column } from './columns';
import { getHeaderRows } from './headerRows';
import type { ColumnFilter, ColumnOrder, SortOn } from './types/config';
import type { ReadableKeys } from './types/ReadableKeys';

export type UseTableConfig<Item> = ColumnOrder<Item> & ColumnFilter<Item> & SortOn<Item>;

export type UseTableProps<Item> = {
	data: Readable<Array<Item>>;
	columns: Array<Column<Item>>;
} & ReadableKeys<UseTableConfig<Item>>;

const Undefined = readable(undefined);

export const useTable = <Item>({
	data,
	columns: rawColumns,
	columnOrder = Undefined,
	hiddenColumns = Undefined,
	sortKeys = Undefined,
}: UseTableProps<Item>) => {
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
