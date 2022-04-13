import type { Label } from './Label';

export type ColumnGroup<Item extends object> = {
	type: 'group';
	header: Label<Item>;
	footer?: Label<Item>;
	columns: Column<Item>[];
};

export type ColumnData<Item extends object> = {
	type: 'data';
	header: Label<Item>;
	footer?: Label<Item>;
	key: keyof Item;
};

export type Column<Item extends object> = ColumnGroup<Item> | ColumnData<Item>;
