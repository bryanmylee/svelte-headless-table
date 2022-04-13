import type { Column } from './Column';

export type ColumnGroupProps<Item extends object> = {
	header: string;
	columns: Column<Item>[];
};

export type ColumnDataProps<Item extends object> = {
	header: string;
	key: keyof Item;
};
