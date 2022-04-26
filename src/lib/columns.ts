import type { AggregateLabel } from './types/AggregateLabel';
import type { ColumnOrder, ColumnFilter } from './types/config';
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

export interface DataColumnInit<Item, Value = unknown> extends Omit<ColumnInit<Item>, 'height'> {
	cell?: Label<Item, Value>;
	accessor: keyof Item | ((item: Item) => Value);
	id?: string;
}

export class DataColumn<Item, Value = unknown> extends Column<Item> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => Value;
	id: string;
	constructor({ header, footer, accessor, id }: DataColumnInit<Item, Value>) {
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

export const column = <Item, Value = unknown>(
	def: DataColumnInit<Item, Value>
): DataColumn<Item, Value> => new DataColumn(def);

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

export type GetFlatColumnsConfig<Item> = ColumnOrder<Item> & ColumnFilter<Item>;

export const getFlatColumns = <Item>(
	columns: Array<Column<Item>>,
	{ columnOrder, hiddenColumns }: GetFlatColumnsConfig<Item> = {}
): Array<DataColumn<Item>> => {
	let flatColumns = _getFlatColumns(columns);
	if (columnOrder !== undefined) {
		flatColumns = getOrderedFlatColumns(flatColumns, columnOrder);
	}
	if (hiddenColumns !== undefined) {
		flatColumns = getHiddenFlatColumns(flatColumns, hiddenColumns);
	}
	return flatColumns;
};

const _getFlatColumns = <Item>(columns: Array<Column<Item>>): Array<DataColumn<Item>> =>
	columns.flatMap((c) =>
		c instanceof DataColumn ? [c] : c instanceof GroupColumn ? _getFlatColumns(c.columns) : []
	);

const getOrderedFlatColumns = <Item>(
	columns: Array<DataColumn<Item>>,
	columnOrder: Array<string>
): Array<DataColumn<Item>> => {
	if (columnOrder.length === 0) {
		return columns;
	}
	const orderedColumns: Array<DataColumn<Item>> = [];
	// Each row of the transposed matrix represents a column.
	// The `DataHeaderCell` is the last cell of each column.
	columnOrder.forEach((key) => {
		const nextColumn = columns.find((column) => column.id === key);
		if (nextColumn !== undefined) {
			orderedColumns.push(nextColumn);
		}
	});
	return orderedColumns;
};

const getHiddenFlatColumns = <Item>(
	columns: Array<DataColumn<Item>>,
	hiddenColumns: Array<string>
): Array<DataColumn<Item>> => {
	return columns.filter((column) => !hiddenColumns.includes(column.id));
};
