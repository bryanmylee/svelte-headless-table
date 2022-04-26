import type { AggregateLabel } from './types/AggregateLabel';
import type { Label } from './types/Label';
import { getDuplicates } from './utils/array';
import { max } from './utils/math';

export interface ColumnInit<Item> {
	header: AggregateLabel<Item>;
	footer?: AggregateLabel<Item>;
	height: number;
}

export class Column<Item> {
	header: AggregateLabel<Item>;
	footer?: AggregateLabel<Item>;
	height: number;
	constructor({ header, footer, height }: ColumnInit<Item>) {
		this.header = header;
		this.footer = footer;
		this.height = height;
	}
}

export interface DataColumnInit<Item> extends Omit<ColumnInit<Item>, 'height'> {
	cell?: Label<Item>;
	accessor: keyof Item | ((item: Item) => unknown);
	id?: string;
}

export class DataColumn<Item> extends Column<Item> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
	id: string;
	constructor({ header, footer, accessor, id }: DataColumnInit<Item>) {
		super({ header, footer, height: 1 });
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

export interface GroupColumnInit<Item> extends Omit<ColumnInit<Item>, 'height'> {
	columns: Array<Column<Item>>;
}

export class GroupColumn<Item> extends Column<Item> {
	columns: Array<Column<Item>>;
	/**
	 * A flatlist of the ids of `DataColumn`s under this group.
	 */
	ids: Array<string>;
	constructor({ header, footer, columns }: GroupColumnInit<Item>) {
		const height = max(columns.map((c) => c.height)) + 1;
		super({ header, footer, height });
		this.columns = columns;
		this.ids = getFlatColumnIds(columns);
	}
}

export const column = <Item>(def: DataColumnInit<Item>): DataColumn<Item> => new DataColumn(def);

export const group = <Item>(def: GroupColumnInit<Item>): GroupColumn<Item> => new GroupColumn(def);

export const createColumns = <Item>(columns: Column<Item>[]): Column<Item>[] => {
	const ids = getFlatColumnIds(columns);
	const duplicateIds = getDuplicates(ids);
	if (duplicateIds.length !== 0) {
		throw new Error(`Duplicate column ids not allowed: "${duplicateIds.join('", "')}"`);
	}
	return columns;
};

const getFlatColumnIds = <Item>(columns: Array<Column<Item>>): Array<string> =>
	columns.flatMap((c) =>
		c instanceof DataColumn ? [c.id] : c instanceof GroupColumn ? c.ids : []
	);

export const getFlatColumns = <Item>(columns: Array<Column<Item>>): Array<Column<Item>> =>
	columns.flatMap((c) =>
		c instanceof DataColumn ? [c] : c instanceof GroupColumn ? getFlatColumns(c.columns) : []
	);
