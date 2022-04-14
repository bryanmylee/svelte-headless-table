import type { Column } from '$lib/models/Column';
import type { ColumnLabel } from './ColumnLabel';
import type { DataCellLabel } from './DataCellLabel';

export type GroupColumnDef<Item extends object> = {
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	columns: Column<Item>[];
};

export type DataColumnDef<Item extends object> = {
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	cell?: DataCellLabel<Item>;
	key: keyof Item;
};
