import { derived, readable, type Readable } from 'svelte/store';
import { getFlatColumns, type Column } from './columns';
import { getHeaderRows } from './headerRows';

export interface UseTableProps<Item> {
	columns: Array<Column<Item>>;
	columnOrder?: Readable<Array<string> | undefined>;
	hiddenColumns?: Readable<Array<string> | undefined>;
}

const Undefined = readable(undefined);

export const useTable = <Item>({
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
	return {
		flatColumns,
		headerRows,
	};
};
