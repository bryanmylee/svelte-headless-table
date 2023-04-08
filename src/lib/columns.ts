import type { DisplayBodyCell } from './bodyCells';
import type { TableState } from './createViewModel';
import type { DisplayLabel, HeaderLabel } from './types/Label';
import type { DataLabel } from './types/Label';
import type { AnyPlugins, PluginColumnConfigs } from './types/TablePlugin';

export interface ColumnInit<Item, Plugins extends AnyPlugins = AnyPlugins> {
	header: HeaderLabel<Item, Plugins>;
	footer?: HeaderLabel<Item, Plugins>;
	height: number;
	plugins?: PluginColumnConfigs<Plugins>;
}

export class Column<Item, Plugins extends AnyPlugins = AnyPlugins> {
	header: HeaderLabel<Item, Plugins>;
	footer?: HeaderLabel<Item, Plugins>;
	height: number;
	plugins?: PluginColumnConfigs<Plugins>;
	constructor({ header, footer, height, plugins }: ColumnInit<Item, Plugins>) {
		this.header = header;
		this.footer = footer;
		this.height = height;
		this.plugins = plugins;
	}

	// TODO Workaround for https://github.com/vitejs/vite/issues/9528
	isFlat(): this is FlatColumn<Item, Plugins> {
		return '__flat' in this;
	}

	// TODO Workaround for https://github.com/vitejs/vite/issues/9528
	isData(): this is DataColumn<Item, Plugins> {
		return '__data' in this;
	}

	// TODO Workaround for https://github.com/vitejs/vite/issues/9528
	isDisplay(): this is DisplayColumn<Item, Plugins> {
		return '__display' in this;
	}

	// TODO Workaround for https://github.com/vitejs/vite/issues/9528
	isGroup(): this is GroupColumn<Item, Plugins> {
		return '__group' in this;
	}
}

export type FlatColumnInit<
	Item,
	Plugins extends AnyPlugins = AnyPlugins,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Id extends string = any
> = Omit<ColumnInit<Item, Plugins>, 'height'> & {
	id?: Id;
};

export class FlatColumn<
	Item,
	Plugins extends AnyPlugins = AnyPlugins,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Id extends string = any
> extends Column<Item, Plugins> {
	// TODO Workaround for https://github.com/vitejs/vite/issues/9528
	__flat = true;

	id: Id;
	constructor({ header, footer, plugins, id }: FlatColumnInit<Item, Plugins>) {
		super({ header, footer, plugins, height: 1 });
		this.id = id ?? String(header);
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
	cell?: DataLabel<Item, Plugins, Value>;
};

export type DataColumnInitKey<Item, Id extends keyof Item> = {
	accessor: Id;
	id?: Id;
};

export type DataColumnInitIdAndKey<Item, Id extends string, Key extends keyof Item> = {
	accessor: Key;
	id?: Id;
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
> extends FlatColumn<Item, Plugins, Id> {
	// TODO Workaround for https://github.com/vitejs/vite/issues/9528
	__data = true;

	cell?: DataLabel<Item, Plugins, Value>;
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => Value;
	constructor({
		header,
		footer,
		plugins,
		cell,
		accessor,
		id,
	}: DataColumnInit<Item, Plugins, Id, Value>) {
		super({ header, footer, plugins, id: 'Initialization not complete' });
		this.cell = cell;
		if (accessor instanceof Function) {
			this.accessorFn = accessor;
		} else {
			this.accessorKey = accessor;
		}
		if (id === undefined && this.accessorKey === undefined && header === undefined) {
			throw new Error('A column id, string accessor, or header is required');
		}
		const accessorKeyId = typeof this.accessorKey === 'string' ? this.accessorKey : null;
		this.id = (id ?? accessorKeyId ?? String(header)) as Id;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getValue(item: Item): any {
		if (this.accessorFn !== undefined) {
			return this.accessorFn(item);
		}
		if (this.accessorKey !== undefined) {
			return item[this.accessorKey];
		}
		return undefined;
	}
}

export type DisplayColumnDataGetter<Item, Plugins extends AnyPlugins = AnyPlugins> = (
	cell: DisplayBodyCell<Item>,
	state?: TableState<Item, Plugins>
) => unknown;

export type DisplayColumnInit<
	Item,
	Plugins extends AnyPlugins = AnyPlugins,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Id extends string = any
> = FlatColumnInit<Item, Plugins, Id> & {
	cell: DisplayLabel<Item, Plugins>;
	data?: DisplayColumnDataGetter<Item, Plugins>;
};

export class DisplayColumn<
	Item,
	Plugins extends AnyPlugins = AnyPlugins,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Id extends string = any
> extends FlatColumn<Item, Plugins, Id> {
	// TODO Workaround for https://github.com/vitejs/vite/issues/9528
	__display = true;

	cell: DisplayLabel<Item, Plugins>;
	data?: DisplayColumnDataGetter<Item, Plugins>;
	constructor({ header, footer, plugins, id, cell, data }: DisplayColumnInit<Item, Plugins, Id>) {
		super({ header, footer, plugins, id });
		this.cell = cell;
		this.data = data;
	}
}

export type GroupColumnInit<Item, Plugins extends AnyPlugins = AnyPlugins> = Omit<
	ColumnInit<Item, Plugins>,
	'height'
> & {
	columns: Column<Item, Plugins>[];
};

export class GroupColumn<Item, Plugins extends AnyPlugins = AnyPlugins> extends Column<
	Item,
	Plugins
> {
	// TODO Workaround for https://github.com/vitejs/vite/issues/9528
	__group = true;

	columns: Column<Item, Plugins>[];
	ids: string[];
	constructor({ header, footer, columns, plugins }: GroupColumnInit<Item, Plugins>) {
		const height = Math.max(...columns.map((c) => c.height)) + 1;
		super({ header, footer, height, plugins });
		this.columns = columns;
		this.ids = getFlatColumnIds(columns);
	}
}

export const getFlatColumnIds = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	columns: Column<Item, Plugins>[]
): string[] => columns.flatMap((c) => (c.isFlat() ? [c.id] : c.isGroup() ? c.ids : []));

export const getFlatColumns = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	columns: Column<Item, Plugins>[]
): FlatColumn<Item, Plugins>[] => {
	return columns.flatMap((c) => (c.isFlat() ? [c] : c.isGroup() ? getFlatColumns(c.columns) : []));
};
