import type { ColumnLabel } from '$lib/types/ColumnLabel';
import type { DataCellLabel } from '$lib/types/DataCellLabel';

export type GroupColumnData<Item extends object> = {
	type: 'group';
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	columns: ColumnData<Item>[];
};

export class GroupColumn<Item extends object> implements GroupColumnData<Item> {
	type = 'group' as const;
	header!: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	columns!: ColumnData<Item>[];
	constructor(props: Omit<GroupColumnData<Item>, 'type'>) {
		Object.assign(this, props);
	}
}

export type DataColumnData<Item extends object> = {
	type: 'data';
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	cell?: DataCellLabel<Item>;
	key: keyof Item;
};

export class DataColumn<Item extends object> implements DataColumnData<Item> {
	type = 'data' as const;
	header!: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	cell?: DataCellLabel<Item>;
	key!: keyof Item;
	constructor(props: Omit<GroupColumnData<Item>, 'type'>) {
		Object.assign(this, props);
	}
}

export type ColumnData<Item extends object> = GroupColumnData<Item> | DataColumnData<Item>;

export type Column<Item extends object> = GroupColumn<Item> | DataColumn<Item>;
