import type { AggregateLabel } from './types/AggregateLabel';
import { max, sum } from './utils/math';

export interface ColumnInit<Item> {
	header: AggregateLabel<Item>;
	footer?: AggregateLabel<Item>;
	colspan: number;
	height: number;
}

export class Column<Item> {
	header: AggregateLabel<Item>;
	footer?: AggregateLabel<Item>;
	colspan: number;
	height: number;
	constructor({ header, footer, colspan, height }: ColumnInit<Item>) {
		this.header = header;
		this.footer = footer;
		this.colspan = colspan;
		this.height = height;
	}
}

export interface DataColumnInit<Item> extends Omit<ColumnInit<Item>, 'colspan' | 'height'> {
	accessor: keyof Item | ((item: Item) => unknown);
}

export class DataColumn<Item> extends Column<Item> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
	constructor({ header, footer, accessor }: DataColumnInit<Item>) {
		super({ header, footer, colspan: 1, height: 1 });
		if (accessor instanceof Function) {
			this.accessorFn = accessor;
		} else {
			this.accessorKey = accessor;
		}
	}
}

export interface GroupColumnInit<Item> extends Omit<ColumnInit<Item>, 'colspan' | 'height'> {
	columns: Array<Column<Item>>;
}

export class GroupColumn<Item> extends Column<Item> {
	columns: Array<Column<Item>>;
	constructor({ header, footer, columns }: GroupColumnInit<Item>) {
		const colspan = sum(columns.map((c) => c.colspan));
		const height = max(columns.map((c) => c.height)) + 1;
		super({ header, footer, colspan, height });
		this.columns = columns;
	}
}

export const column = <Item>(def: DataColumnInit<Item>): Column<Item> => new DataColumn(def);

export const group = <Item>(def: GroupColumnInit<Item>): Column<Item> => new GroupColumn(def);

export const createColumns = <Item>(columns: Column<Item>[]): Column<Item>[] => columns;
