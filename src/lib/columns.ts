import type { KeyPath } from './types/KeyPath';

export interface ColumnInit<Item> {
	header: string;
	footer?: string;
}

export class Column<Item> {
	header: string;
	footer?: string;
	constructor({ header, footer }: ColumnInit<Item>) {
		this.header = header;
		this.footer = footer;
	}
}

export interface DataColumnInit<Item> extends ColumnInit<Item> {
	accessor: string | KeyPath<Item> | ((item: Item) => unknown);
	accessorFn?: (item: Item) => unknown;
}

export class DataColumn<Item> extends Column<Item> {
	accessorKey?: string | KeyPath<Item>;
	accessorFn?: (item: Item) => unknown;
	constructor({ header, footer, accessor }: DataColumnInit<Item>) {
		super({ header, footer });
		if (accessor instanceof Function) {
			this.accessorFn = accessor;
		} else {
			this.accessorKey = accessor;
		}
	}
}

export const column = <Item>(def: DataColumnInit<Item>): DataColumn<Item> => new DataColumn(def);

export interface GroupColumnInit<Item> extends ColumnInit<Item> {
	columns: Column<Item>;
}

export class GroupColumn<Item> extends Column<Item> {
	columns!: Column<Item>;
	constructor({ header, footer, columns }: GroupColumnInit<Item>) {
		super({ header, footer });
		this.columns = columns;
	}
}

export const group = <Item>(def: DataColumnInit<Item>): DataColumn<Item> => new DataColumn(def);
