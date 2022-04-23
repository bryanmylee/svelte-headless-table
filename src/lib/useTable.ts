import type { Column } from './columns';

export interface UseTableProps<Item> {
	columns: Array<Column<Item>>;
}

export const useTable = <Item>({ columns }: UseTableProps<Item>) => {};
