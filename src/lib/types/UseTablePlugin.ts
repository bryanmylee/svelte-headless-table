import type { BodyCell, BodyCellAttributes } from '$lib/bodyCells';
import type { BodyRow, BodyRowAttributes } from '$lib/bodyRows';
import type { DataColumn } from '$lib/columns';
import type { HeaderCell, HeaderCellAttributes } from '$lib/headerCells';
import type { HeaderRow, HeaderRowAttributes } from '$lib/headerRows';
import type { UseTableState } from '$lib/useTable';
import type { Readable } from 'svelte/store';

export type UseTablePlugin<
	Item,
	PluginState,
	ColumnOptions,
	TablePropSet extends AnyTablePropSet
> = (
	init: UseTablePluginInit<Item, ColumnOptions>
) => UseTablePluginInstance<Item, PluginState, ColumnOptions, TablePropSet>;

export type UseTablePluginInit<Item, ColumnOptions> = {
	pluginName: string;
	tableState: UseTableState<Item>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	columnOptions: Record<string, ColumnOptions>;
};

export type UseTablePluginInstance<
	Item,
	PluginState,
	ColumnOptions,
	TablePropSet extends AnyTablePropSet
> = {
	pluginState: PluginState;
	transformFlatColumnsFn?: Readable<TransformFlatColumnsFn<Item>>;
	transformRowsFn?: Readable<TransformRowsFn<Item>>;
	columnOptions?: ColumnOptions;
	hooks?: TableHooks<Item, TablePropSet>;
};

export type AnyPlugins = Record<
	string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	UseTablePlugin<any, any, any, any>
>;

export type AnyPluginInstances = Record<
	string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	UseTablePluginInstance<
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		any
	>
>;

export type TransformFlatColumnsFn<Item> = (flatColumns: DataColumn<Item>[]) => DataColumn<Item>[];
export type TransformRowsFn<Item> = (rows: BodyRow<Item>[]) => BodyRow<Item>[];

export type Components<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	'thead.tr': HeaderRow<Item, Plugins>;
	'thead.tr.th': HeaderCell<Item, Plugins>;
	'tbody.tr': BodyRow<Item, Plugins>;
	'tbody.tr.td': BodyCell<Item, Plugins>;
};

export type AttributesForKey<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	'thead.tr': HeaderRowAttributes<Item, Plugins>;
	'thead.tr.th': HeaderCellAttributes<Item, Plugins>;
	'tbody.tr': BodyRowAttributes<Item, Plugins>;
	'tbody.tr.td': BodyCellAttributes<Item, Plugins>;
};

export type ComponentKeys = keyof Components<unknown>;

type TablePropSet<
	PropSet extends {
		[K in ComponentKeys]?: unknown;
	}
> = {
	[K in ComponentKeys]: PropSet[K];
};

export type NewTablePropSet<
	PropSet extends {
		[K in ComponentKeys]?: unknown;
	}
> = {
	[K in ComponentKeys]: unknown extends PropSet[K] ? never : PropSet[K];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTablePropSet = TablePropSet<any>;

export type TableHooks<Item, PropSet extends AnyTablePropSet = AnyTablePropSet> = {
	[ComponentKey in keyof Components<Item>]?: (
		component: Components<Item>[ComponentKey]
	) => ElementHook<PropSet[ComponentKey]>;
};

export type ElementHook<Props> = {
	props?: Readable<Props>;
};

export type PluginStates<Plugins extends AnyPlugins> = {
	[K in keyof Plugins]: ReturnType<Plugins[K]>['pluginState'];
};

type TablePropSetForPluginKey<Plugins extends AnyPlugins> = {
	// Plugins[K] does not extend UseTablePlugin<unknown, unknown, unknown, infer TablePropSet>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[K in keyof Plugins]: Plugins[K] extends UseTablePlugin<any, any, any, infer TablePropSet>
		? TablePropSet
		: never;
};

export type PluginTablePropSet<Plugins extends AnyPlugins> = {
	[ComponentKey in ComponentKeys]: {
		[PluginKey in keyof Plugins]: TablePropSetForPluginKey<Plugins>[PluginKey][ComponentKey];
	};
};

export type PluginColumnConfigs<Plugins extends AnyPlugins> = Partial<{
	[K in keyof Plugins]: ReturnType<Plugins[K]>['columnOptions'];
}>;
