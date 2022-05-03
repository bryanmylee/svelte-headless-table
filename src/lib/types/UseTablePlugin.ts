import type { BodyCell, BodyCellAttributes } from '$lib/bodyCells';
import type { BodyRow, BodyRowAttributes } from '$lib/bodyRows';
import type { HeaderCell, HeaderCellAttributes } from '$lib/headerCells';
import type { HeaderRow, HeaderRowAttributes } from '$lib/headerRows';
import type { Readable } from 'svelte/store';
import type { ComponentKeys } from './ComponentKeys';

export type UseTablePlugin<
	Item,
	PluginState,
	ColumnConfig,
	E extends TablePropSet = AnyTablePropSet
> = {
	pluginState: PluginState;
	sortFn?: Readable<SortFn<Item>>;
	filterFn?: Readable<FilterFn<Item>>;
	visibleColumnIdsFn?: Readable<VisibleColumnIdsFn>;
	columnConfig: ColumnConfig;
	hooks?: TableHooks<Item, E>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyPlugins = Record<string, UseTablePlugin<any, any, any>>;

export type SortFn<Item> = (a: BodyRow<Item>, b: BodyRow<Item>) => number;
export type FilterFn<Item> = (row: BodyRow<Item>) => boolean;
export type VisibleColumnIdsFn = (ids: Array<string>) => Array<string>;

export type AttributesForKey<Item> = {
	'thead.tr': HeaderRowAttributes<Item>;
	'thead.tr.th': HeaderCellAttributes<Item>;
	'tbody.tr': BodyRowAttributes<Item>;
	'tbody.tr.td': BodyCellAttributes<Item>;
};

export type ComponentForKey<Item> = {
	'thead.tr': HeaderRow<Item>;
	'thead.tr.th': HeaderCell<Item>;
	'tbody.tr': BodyRow<Item>;
	'tbody.tr.td': BodyCell<Item>;
};

export type TablePropSet<
	HeaderRowProps = unknown,
	HeaderCellProps = unknown,
	BodyRowProps = unknown,
	BodyCellProps = unknown
> = {
	'thead.tr': HeaderRowProps;
	'thead.tr.th': HeaderCellProps;
	'tbody.tr': BodyRowProps;
	'tbody.tr.td': BodyCellProps;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTablePropSet = TablePropSet<any, any>;

export type TableHooks<Item, E extends TablePropSet = AnyTablePropSet> = {
	[K in keyof ComponentForKey<Item>]?: (component: ComponentForKey<Item>[K]) => ElementHook<E[K]>;
};

export type ElementHook<Props> = {
	eventHandlers?: Array<EventHandler>;
	props?: Readable<Props>;
};

export type EventHandler = {
	type: 'click';
	callback: (event: MouseEvent) => void;
};

export type PluginStates<Plugins extends AnyPlugins> = {
	[K in keyof Plugins]: Plugins[K]['pluginState'];
};

type TablePropSetForPluginKey<Plugins extends AnyPlugins> = {
	[K in keyof Plugins]: Plugins[K] extends UseTablePlugin<unknown, unknown, unknown, infer E>
		? E
		: never;
};

export type PluginTablePropSet<Plugins extends AnyPlugins> = {
	[ComponentKey in ComponentKeys]: {
		[PluginKey in keyof Plugins]: TablePropSetForPluginKey<Plugins>[PluginKey][ComponentKey];
	};
};

export type PluginColumnConfigs<Plugins extends AnyPlugins> = {
	[K in keyof Plugins]: Plugins[K]['columnConfig'];
};
