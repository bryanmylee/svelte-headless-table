import type { BodyRow } from '$lib/bodyRows';
import type { HeaderCell } from '$lib/headerCells';
import type { HeaderRow } from '$lib/headerRows';
import type { Readable } from 'svelte/store';

export type UseTablePlugin<Item, PluginState, E extends ExtraPropSet = AnyExtraPropSet> = {
	pluginState: PluginState;
	sortFn?: Readable<(a: BodyRow<Item>, b: BodyRow<Item>) => number>;
	flatColumnIdFn?: Readable<(ids: Array<string>) => Array<string>>;
	hooks?: TableHooks<Item, E>;
};

export type KeyToComponent<Item> = {
	'thead.tr': HeaderRow<Item>;
	'thead.tr.th': HeaderCell<Item>;
};

export type ExtraPropSet<HeaderRowExtraProps = unknown, HeaderCellExtraProps = unknown> = {
	'thead.tr': HeaderRowExtraProps;
	'thead.tr.th': HeaderCellExtraProps;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyExtraPropSet = ExtraPropSet<any, any>;

export type TableHooks<Item, E extends ExtraPropSet = AnyExtraPropSet> = {
	[K in keyof KeyToComponent<Item>]?: (component: KeyToComponent<Item>[K]) => ElementHook<E[K]>;
};

export type ElementHook<ExtraProps> = {
	eventHandlers?: Array<EventHandler>;
	extraProps?: Readable<ExtraProps>;
};

export type EventHandler = {
	type: 'click';
	callback: (event: MouseEvent) => void;
};
