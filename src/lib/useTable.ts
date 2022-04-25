import { derived, readable, type Readable } from 'svelte/store';
import type { Column } from './columns';
import { getHeaderRows } from './headerRows';

export interface UseTableProps<Item> {
	columns: Array<Column<Item>>;
	columnOrder?: Readable<Array<string> | undefined>;
	hiddenColumns?: Readable<Array<string> | undefined>;
}

const Undefined = readable(undefined);

export const useTable = <Item>({
	columns,
	columnOrder = Undefined,
	hiddenColumns = Undefined,
}: UseTableProps<Item>) => {
	const headerRows = derived([columnOrder, hiddenColumns], ([$columnOrder, $hiddenColumns]) => {
		return getHeaderRows(columns, {
			columnOrder: $columnOrder,
			hiddenColumns: $hiddenColumns,
		});
	});
};
