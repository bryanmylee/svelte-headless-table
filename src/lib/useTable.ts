import { writable } from 'svelte/store';
import type { Column } from './models/Column';
import { TableInstance } from './models/TableInstance';

export interface UseTableProps<Item extends object> {
	columns: Column<Item>[];
	data: Item[];
}

export const useTable = <Item extends object>({ data, columns }: UseTableProps<Item>) => {
	const instance = writable(new TableInstance({ data, columns }));
	return instance;
};
