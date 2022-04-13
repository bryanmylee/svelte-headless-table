import type { RowsLabel } from './RowsLabel';

export type ColumnGroup<Item extends object> = {
	type: 'group';
	header: RowsLabel<Item>;
	footer?: RowsLabel<Item>;
	columns: Column<Item>[];
};

export type ColumnData<Item extends object> = {
	type: 'data';
	header: RowsLabel<Item>;
	footer?: RowsLabel<Item>;
	key: keyof Item;
};

export type Column<Item extends object> = ColumnGroup<Item> | ColumnData<Item>;
