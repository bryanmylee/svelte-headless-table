import { writable, type Writable } from 'svelte/store';
import { keyed } from 'svelte-keyed';
import type { Column } from './models/Column';
import { TableInstance } from './models/TableInstance';
import type { HeaderRow } from './models/HeaderRow';
import type { DataRow } from './models/DataRow';
import type { FooterRow } from './models/FooterRow';
import type { WritableKeys } from './types/WritableKeys';

export interface UseTableProps<Item extends object> {
	columns: Column<Item>[];
	data: Item[];
}

export interface UseTable<Item extends object> {
	headerRows: Writable<HeaderRow<Item>[]>;
	dataRows: Writable<DataRow<Item>[]>;
	footerRows: Writable<FooterRow<Item>[]>;
}

export const useTable = <Item extends object>({
	data,
	columns,
}: UseTableProps<Item>): Omit<WritableKeys<TableInstance<Item>>, 'data' | 'columns'> => {
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
