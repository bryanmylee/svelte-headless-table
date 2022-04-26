import { derived, readable, type Readable } from 'svelte/store';
import { getBodyRows } from './bodyRows';
import { getFlatColumns, type Column } from './columns';
import { getHeaderRows } from './headerRows';
import type { ColumnFilter, ColumnOrder } from './types/config';
import type { ReadableKeys } from './types/ReadableKeys';

export type UseTableConfig<Item> = ColumnOrder<Item> & ColumnFilter<Item>;

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
	const bodyRows = derived([data, flatColumns], ([$data, $flatColumns]) => {
		return getBodyRows($data, $flatColumns);
	});
	return {
		flatColumns,
		headerRows,
		bodyRows,
	};
};
