import type { AggregateLabel } from './types/AggregateLabel';
import type { Label } from './types/Label';
import type { AnyPlugins } from './types/UseTablePlugin';
import { max } from './utils/math';

export interface ColumnInit<Item> {
	header: AggregateLabel<Item>;
	footer?: AggregateLabel<Item>;
	height: number;
}

export class Column<Item, Plugins extends AnyPlugins = AnyPlugins> {
	header: AggregateLabel<Item>;
	footer?: AggregateLabel<Item>;
	height: number;
	constructor({ header, footer, height }: ColumnInit<Item>) {
		this.header = header;
		this.footer = footer;
		this.height = height;
	}
}

export type DataColumnInit<Item, Id extends string, Value> = DataColumnInitBase<Item, Value> &
	(
		| (Id extends keyof Item ? DataColumnInitKey<Item, Id> : never)
		| DataColumnInitIdAndKey<Item, Id, keyof Item>
		| DataColumnInitFnAndId<Item, Id, Value>
	);

export type DataColumnInitBase<Item, Value> = Omit<ColumnInit<Item>, 'height'> & {
	cell?: Label<Item, Value>;
	sortKey?: (value: Value) => string | number;
};

export type DataColumnInitKey<Item, Id extends keyof Item> = {
	accessor: Id;
	id?: Id;
};

export type DataColumnInitIdAndKey<Item, Id extends string, Key extends keyof Item> = {
	accessor: Key;
	id: Id;
};

export type DataColumnInitFnAndId<Item, Id extends string, Value> = {
	accessor: keyof Item | ((item: Item) => Value);
	id?: Id;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DataColumn<Item, Id extends string = any, Value = any> extends Column<Item> {
	cell?: Label<Item, Value>;
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => Value;
	id: Id;
	sortOnFn?: (value: Value) => string | number;
	constructor({ header, footer, cell, accessor, id, sortKey }: DataColumnInit<Item, Id, Value>) {
		super({ header, footer, height: 1 });
		this.cell = cell;
		if (accessor instanceof Function) {
			this.accessorFn = accessor;
		} else {
			this.accessorKey = accessor;
		}
		if (id === undefined && this.accessorKey === undefined) {
			throw new Error('A column id or string accessor is required');
		}
		this.id = (id ?? `${this.accessorKey}`) as Id;
		this.sortOnFn = sortKey;
	}
}

export interface GroupColumnInit<Item> extends Omit<ColumnInit<Item>, 'height'> {
	columns: Array<Column<Item>>;
}

export class GroupColumn<Item> extends Column<Item> {
	columns: Array<Column<Item>>;
	ids: Array<string>;
	constructor({ header, footer, columns }: GroupColumnInit<Item>) {
		const height = max(columns.map((c) => c.height)) + 1;
		super({ header, footer, height });
		this.columns = columns;
		this.ids = getFlatColumnIds(columns);
	}
}

export const getFlatColumnIds = <Item>(columns: Array<Column<Item>>): Array<string> =>
	columns.flatMap((c) =>
		c instanceof DataColumn ? [c.id] : c instanceof GroupColumn ? c.ids : []
	);

export const getFlatColumns = <Item>(columns: Array<Column<Item>>): Array<DataColumn<Item>> => {
	return columns.flatMap((c) =>
		c instanceof DataColumn ? [c] : c instanceof GroupColumn ? getFlatColumns(c.columns) : []
	);
};
