import { writable } from 'svelte/store';
import { keyed } from 'svelte-keyed';
import type { Column } from './models/Column';
import { TableInstance, type TableInstanceInit } from './models/TableInstance';
import type { WritableKeys } from './types/WritableKeys';

export interface UseTableProps<Item extends object> {
	columns: Column<Item>[];
	data: Item[];
}

export type UseTable<Item extends object> = Omit<
	WritableKeys<TableInstance<Item>>,
	keyof TableInstanceInit<Item>
>;

export const useTable = <Item extends object>({
	data,
	columns,
}: UseTableProps<Item>): UseTable<Item> => {
	const instance = writable(new TableInstance({ data, columns }));
	const dataColumns = keyed(instance, 'dataColumns');
	const headerRows = keyed(instance, 'headerRows');
	const dataRows = keyed(instance, 'dataRows');
	const footerRows = keyed(instance, 'footerRows');
	return {
		dataColumns,
		headerRows,
		dataRows,
		footerRows,
	};
};
