import type { ColumnLabel } from './ColumnLabel';
import type { DataCellLabel } from './DataCellLabel';

export type ColumnGroup<Item extends object> = {
	type: 'group';
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	columns: Column<Item>[];
};

export type ColumnData<Item extends object> = {
	type: 'data';
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	cell?: DataCellLabel<Item>;
	key: keyof Item;
};

export type Column<Item extends object> = ColumnGroup<Item> | ColumnData<Item>;
