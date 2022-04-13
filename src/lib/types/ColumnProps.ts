import type { Column } from './Column';
import type { ColumnLabel } from './ColumnLabel';

export type ColumnGroupProps<Item extends object> = {
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	columns: Column<Item>[];
};

export type ColumnDataProps<Item extends object> = {
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	key: keyof Item;
};
