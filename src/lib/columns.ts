import type { AggregateLabel } from './types/AggregateLabel';
import type { Label } from './types/Label';
import { duplicates } from './utils/array';
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
	cell?: Label<Item>;
	accessor: keyof Item | ((item: Item) => unknown);
	id?: string;
}

export class DataColumn<Item> extends Column<Item> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
	id: string;
	constructor({ header, footer, accessor, id }: DataColumnInit<Item>) {
		super({ header, footer, colspan: 1, height: 1 });
		if (accessor instanceof Function) {
			this.accessorFn = accessor;
		} else {
			this.accessorKey = accessor;
		}
		if (id === undefined && this.accessorKey === undefined) {
			throw new Error('A column id or string accessor is required');
		}
		this.id = id ?? `${this.accessorKey}`;
	}
}

export interface GroupColumnInit<Item> extends Omit<ColumnInit<Item>, 'colspan' | 'height'> {
	columns: Array<Column<Item>>;
}

const getFlatColumnIds = <Item>(columns: Array<Column<Item>>): Array<string> =>
	columns.flatMap((c) =>
		c instanceof DataColumn ? [c.id] : c instanceof GroupColumn ? c.ids : []
	);

export class GroupColumn<Item> extends Column<Item> {
	columns: Array<Column<Item>>;
	ids: Array<string>;
	constructor({ header, footer, columns }: GroupColumnInit<Item>) {
		const colspan = sum(columns.map((c) => c.colspan));
		const height = max(columns.map((c) => c.height)) + 1;
		super({ header, footer, colspan, height });
		this.columns = columns;
		this.ids = getFlatColumnIds(columns);
	}
}

export const column = <Item>(def: DataColumnInit<Item>): DataColumn<Item> => new DataColumn(def);

export const group = <Item>(def: GroupColumnInit<Item>): GroupColumn<Item> => new GroupColumn(def);

export const createColumns = <Item>(columns: Column<Item>[]): Column<Item>[] => {
	const ids = getFlatColumnIds(columns);
	const duplicateIds = duplicates(ids);
	if (duplicateIds.length !== 0) {
		throw new Error(`Duplicate column ids not allowed: "${duplicateIds.join('", "')}"`);
	}
	return columns;
};
