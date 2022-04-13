import type { Column } from './Column';
import type { RowsLabel } from './RowsLabel';

export type ColumnGroupProps<Item extends object> = {
	header: RowsLabel<Item>;
	footer?: RowsLabel<Item>;
	columns: Column<Item>[];
};

export type ColumnDataProps<Item extends object> = {
	header: RowsLabel<Item>;
	footer?: RowsLabel<Item>;
	key: keyof Item;
};
