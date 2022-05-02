import type { AggregateLabel } from './types/AggregateLabel';
import type { Label } from './types/Label';
import { getDuplicates } from './utils/array';
import { max } from './utils/math';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// `accessorKey` only
export function column<Item, Id extends Exclude<keyof Item, symbol>>(
	def: DataColumnInitBase<Item, Item[Id]> & DataColumnInitKey<Item, Id>
): DataColumn<Item, `${Id}`, Item[Id]>;
// `accessorKey` and `id`
export function column<Item, Id extends string, Key extends keyof Item>(
	def: DataColumnInitBase<Item, Item[Key]> & DataColumnInitIdAndKey<Item, Id, Key>
): DataColumn<Item, Id, Item[Key]>;
// `accessorFn` and `id`
export function column<Item, Id extends string, Value>(
	def: DataColumnInitBase<Item, Value> & DataColumnInitFnAndId<Item, Id, Value>
): DataColumn<Item, Id, Value>;
export function column<Item, Id extends string, Value>(
	def: DataColumnInit<Item, Id, Value>
): DataColumn<Item, Id, Value> {
	return new DataColumn(def);
}

export const group = <Item>(def: GroupColumnInit<Item>): GroupColumn<Item> => new GroupColumn(def);

export const createColumns = <Item>(columns: Array<Column<Item>>): Array<Column<Item>> => {
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

export const getFlatColumns = <Item>(columns: Array<Column<Item>>): Array<DataColumn<Item>> => {
	const flatColumns = _getFlatColumns(columns);
	return flatColumns;
};

const _getFlatColumns = <Item>(columns: Array<Column<Item>>): Array<DataColumn<Item>> =>
	columns.flatMap((c) =>
		c instanceof DataColumn ? [c] : c instanceof GroupColumn ? _getFlatColumns(c.columns) : []
	);

// const getOrderedFlatColumns = <Item>(
// 	columns: Array<DataColumn<Item>>,
// 	columnOrder: Array<string>
// ): Array<DataColumn<Item>> => {
// 	if (columnOrder.length === 0) {
// 		return columns;
// 	}
// 	const orderedColumns: Array<DataColumn<Item>> = [];
// 	// Each row of the transposed matrix represents a column.
// 	// The `DataHeaderCell` is the last cell of each column.
// 	columnOrder.forEach((key) => {
// 		const nextColumn = columns.find((column) => column.id === key);
// 		if (nextColumn !== undefined) {
// 			orderedColumns.push(nextColumn);
// 		}
// 	});
// 	return orderedColumns;
// };

// const getHiddenFlatColumns = <Item>(
// 	columns: Array<DataColumn<Item>>,
// 	hiddenColumns: Array<string>
// ): Array<DataColumn<Item>> => {
// 	return columns.filter((column) => !hiddenColumns.includes(column.id));
// };
