import type { Column } from './Column';
import type { Label } from './Label';

export type ColumnGroupProps<Item extends object> = {
	header: Label<Item>;
	footer?: Label<Item>;
	columns: Column<Item>[];
};

export type ColumnDataProps<Item extends object> = {
	header: Label<Item>;
	footer?: Label<Item>;
	key: keyof Item;
};
