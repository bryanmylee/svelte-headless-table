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

export type DataColumnInit<
	Item,
	Id extends string,
	ValueForId extends Record<string, unknown>
> = DataColumnInitBase<Item, Id, ValueForId> &
	(
		| (Id extends keyof Item ? DataColumnInitKey<Item, Id> : never)
		| DataColumnInitKeyAndId<Item, Id>
		| DataColumnInitFnAndId<Item, Id, ValueForId>
	);

export type DataColumnInitBase<
	Item,
	Id extends string,
	ValueForId extends Record<string, unknown>
> = Omit<ColumnInit<Item>, 'height'> & {
	cell?: Label<Item, ValueForId[Id]>;
	sortKey?: (value: ValueForId[Id]) => string | number;
};

export type DataColumnInitKey<Item, Id extends keyof Item> = {
	accessor: Id;
	id?: Id;
};

export type DataColumnInitKeyAndId<Item, Id extends string> = {
	accessor: keyof Item;
	id: Id;
};

export type DataColumnInitFnAndId<
	Item,
	Id extends string,
	ValueForId extends Record<string, unknown>
> = {
	accessor: keyof Item | ((item: Item) => ValueForId[Id]);
	id?: Id;
};

export class DataColumn<
	Item,
	Id extends string = any,
	ValueForId extends Record<string, unknown> = Record<string, any>
> extends Column<Item> {
	cell?: Label<Item, ValueForId[Id]>;
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => ValueForId[Id];
	id: Id;
	sortOnFn?: (value: ValueForId[Id]) => string | number;
	constructor({
		header,
		footer,
		cell,
		accessor,
		id,
		sortKey,
	}: DataColumnInit<Item, Id, ValueForId>) {
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

export function column<
	Item,
	Id extends Exclude<keyof Item, symbol>,
	ValueForId extends Record<string, unknown>
>(
	def: DataColumnInitBase<Item, `${Id}`, ValueForId> & DataColumnInitKey<Item, Id>
): DataColumn<Item, `${Id}`, ValueForId>;
export function column<Item, Id extends string, ValueForId extends Record<string, unknown>>(
	def: DataColumnInitBase<Item, Id, ValueForId> & DataColumnInitKeyAndId<Item, Id>
): DataColumn<Item, Id, ValueForId>;
export function column<Item, Id extends string, ValueForId extends Record<string, unknown>>(
	def: DataColumnInitBase<Item, Id, ValueForId> & DataColumnInitFnAndId<Item, Id, ValueForId>
): DataColumn<Item, Id, ValueForId>;
export function column<Item, Id extends string, ValueForId extends Record<string, unknown>>(
	def: DataColumnInit<Item, Id, ValueForId>
): DataColumn<Item, Id, ValueForId> {
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
