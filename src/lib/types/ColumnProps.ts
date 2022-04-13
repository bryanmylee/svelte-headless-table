import type { Column } from './Column';
import type { ColumnLabel } from './ColumnLabel';
import type { DataCellLabel } from './DataCellLabel';

export type ColumnGroupProps<Item extends object> = {
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	columns: Column<Item>[];
};

export type ColumnDataProps<Item extends object> = {
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	cell?: DataCellLabel<Item>;
	key: keyof Item;
};
