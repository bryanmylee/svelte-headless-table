import type { Column } from './columns';
import { getHeaderRows } from './headerRows';

export interface UseTableProps<Item> {
	columns: Array<Column<Item>>;
}

export const useTable = <Item>({ columns }: UseTableProps<Item>) => {
	const headerRows = getHeaderRows(columns);
};
