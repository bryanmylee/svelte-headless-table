import type { ColumnData } from '$lib/models/Column';
import type { ColumnLabel } from './ColumnLabel';
import type { DataCellLabel } from './DataCellLabel';

export type ColumnGroupProps<Item extends object> = {
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	columns: ColumnData<Item>[];
};

export type ColumnDataProps<Item extends object> = {
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	cell?: DataCellLabel<Item>;
	key: keyof Item;
};
