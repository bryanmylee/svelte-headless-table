import type { ColumnLabel } from '$lib/types/ColumnLabel';
import type { DataCellLabel } from '$lib/types/DataCellLabel';

export interface ColumnInit<Item extends object> {
	header: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
}

export class Column<Item extends object> {
	header!: ColumnLabel<Item>;
	footer?: ColumnLabel<Item>;
	constructor({ header, footer }: ColumnInit<Item>) {
		Object.assign(this, { header, footer });
	}
}

export type GroupColumnInit<Item extends object> = {
	columns: Column<Item>[];
};

export class GroupColumn<Item extends object> extends Column<Item> {
	columns!: Column<Item>[];
	constructor({ header, footer, columns }: ColumnInit<Item> & GroupColumnInit<Item>) {
		super({ header, footer });
		Object.assign(this, { columns });
	}
}

export type DataColumnInit<Item extends object> = {
	key: keyof Item;
	cell?: DataCellLabel<Item>;
};

export class DataColumn<Item extends object> extends Column<Item> {
	key!: keyof Item;
	cell?: DataCellLabel<Item>;
	constructor({ header, footer, key, cell }: ColumnInit<Item> & DataColumnInit<Item>) {
		super({ header, footer });
		Object.assign(this, { key, cell });
	}
}
