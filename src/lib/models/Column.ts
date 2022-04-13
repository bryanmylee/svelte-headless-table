import type { ColumnLabel } from '$lib/types/ColumnLabel';
import type { DataCellLabel } from '$lib/types/DataCellLabel';

export type GroupColumnData<Item extends object> = {
	type: 'group';
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	columns: ColumnData<Item>[];
};

export type DataColumnData<Item extends object> = {
	type: 'data';
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	cell?: DataCellLabel<Item>;
	key: keyof Item;
};

export type ColumnData<Item extends object> = GroupColumnData<Item> | DataColumnData<Item>;
