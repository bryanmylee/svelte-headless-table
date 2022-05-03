import type { BodyCell, BodyCellAttributes } from '$lib/bodyCells';
import type { BodyRow, BodyRowAttributes } from '$lib/bodyRows';
import type { HeaderCell, HeaderCellAttributes } from '$lib/headerCells';
import type { HeaderRow, HeaderRowAttributes } from '$lib/headerRows';
import type { Readable } from 'svelte/store';
import type { ComponentKeys } from './ComponentKeys';

export type UseTablePlugin<
	Item,
	PluginState = never,
	ColumnConfig = never,
	T extends TablePropSet = AnyTablePropSet
> = {
	pluginState: PluginState;
	sortFn?: Readable<SortFn<Item>>;
	filterFn?: Readable<FilterFn<Item>>;
	visibleColumnIdsFn?: Readable<VisibleColumnIdsFn>;
	columnConfig?: ColumnConfig;
	hooks?: TableHooks<Item, T>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyPlugins = Record<string, UseTablePlugin<any, any, any, AnyTablePropSet>>;

export type SortFn<Item> = (a: BodyRow<Item>, b: BodyRow<Item>) => number;
export type FilterFn<Item> = (row: BodyRow<Item>) => boolean;
export type VisibleColumnIdsFn = (ids: Array<string>) => Array<string>;

export type AttributesForKey<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	'thead.tr': HeaderRowAttributes<Item, Plugins>;
	'thead.tr.th': HeaderCellAttributes<Item, Plugins>;
	'tbody.tr': BodyRowAttributes<Item, Plugins>;
	'tbody.tr.td': BodyCellAttributes<Item, Plugins>;
};

export type ComponentForKey<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	'thead.tr': HeaderRow<Item, Plugins>;
	'thead.tr.th': HeaderCell<Item, Plugins>;
	'tbody.tr': BodyRow<Item, Plugins>;
	'tbody.tr.td': BodyCell<Item, Plugins>;
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

export type TableHooks<Item, T extends TablePropSet = AnyTablePropSet> = {
	[K in keyof ComponentForKey<Item>]?: (component: ComponentForKey<Item>[K]) => ElementHook<T[K]>;
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

export type PluginColumnConfigs<Plugins extends AnyPlugins> = Partial<{
	[K in keyof Plugins]: Plugins[K]['columnConfig'];
}>;
