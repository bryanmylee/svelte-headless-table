import type { HeaderLabel } from './types/Label';
import type { Label } from './types/Label';
import type { AnyPlugins, PluginColumnConfigs } from './types/UseTablePlugin';
import { max } from './utils/math';

export interface ColumnInit<Item, Plugins extends AnyPlugins = AnyPlugins> {
	header: HeaderLabel<Item>;
	footer?: HeaderLabel<Item>;
	height: number;
	plugins?: PluginColumnConfigs<Plugins>;
}

export class Column<Item, Plugins extends AnyPlugins = AnyPlugins> {
	header: HeaderLabel<Item>;
	footer?: HeaderLabel<Item>;
	height: number;
	plugins?: PluginColumnConfigs<Plugins>;
	constructor({ header, footer, height, plugins }: ColumnInit<Item, Plugins>) {
		this.header = header;
		this.footer = footer;
		this.height = height;
		this.plugins = plugins;
	}
}

export type DataColumnInit<
	Item,
	Plugins extends AnyPlugins = AnyPlugins,
	Id extends string = string,
	Value = unknown
> = DataColumnInitBase<Item, Plugins, Value> &
	(
		| (Id extends keyof Item ? DataColumnInitKey<Item, Id> : never)
		| DataColumnInitIdAndKey<Item, Id, keyof Item>
		| DataColumnInitFnAndId<Item, Id, Value>
	);

export type DataColumnInitBase<
	Item,
	Plugins extends AnyPlugins = AnyPlugins,
	Value = unknown
> = Omit<ColumnInit<Item, Plugins>, 'height'> & {
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

export class DataColumn<
	Item,
	Plugins extends AnyPlugins = AnyPlugins,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Id extends string = any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Value = any
> extends Column<Item, Plugins> {
	cell?: Label<Item, Value>;
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => Value;
	id: Id;
	sortOnFn?: (value: Value) => string | number;
	constructor({
		header,
		footer,
		plugins,
		cell,
		accessor,
		id,
		sortKey,
	}: DataColumnInit<Item, Plugins, Id, Value>) {
		super({ header, footer, height: 1, plugins });
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

export interface GroupColumnInit<Item, Plugins extends AnyPlugins = AnyPlugins>
	extends Omit<ColumnInit<Item, Plugins>, 'height'> {
	columns: Column<Item, Plugins>[];
}

export class GroupColumn<Item, Plugins extends AnyPlugins = AnyPlugins> extends Column<
	Item,
	Plugins
> {
	columns: Column<Item, Plugins>[];
	ids: string[];
	constructor({ header, footer, columns, plugins }: GroupColumnInit<Item, Plugins>) {
		const height = max(columns.map((c) => c.height)) + 1;
		super({ header, footer, height, plugins });
		this.columns = columns;
		this.ids = getDataColumnIds(columns);
	}
}

export const getDataColumnIds = <Item>(columns: Column<Item>[]): string[] =>
	columns.flatMap((c) =>
		c instanceof DataColumn ? [c.id] : c instanceof GroupColumn ? c.ids : []
	);

export const getDataColumns = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	columns: Column<Item, Plugins>[]
): DataColumn<Item, Plugins>[] => {
	return columns.flatMap((c) =>
		c instanceof DataColumn ? [c] : c instanceof GroupColumn ? getDataColumns(c.columns) : []
	);
};
