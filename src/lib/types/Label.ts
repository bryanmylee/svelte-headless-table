import type { DataBodyCell, DisplayBodyCell } from '$lib/bodyCells';
import type { TableState } from '$lib/createViewModel';
import type { HeaderCell } from '$lib/headerCells';
import type { RenderConfig } from '$lib/render';
import type { AnyPlugins } from './TablePlugin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataLabel<Item, Plugins extends AnyPlugins = AnyPlugins, Value = any> = (
	cell: DataBodyCell<Item, Plugins, Value>,
	state: TableState<Item, Plugins>
) => RenderConfig;

export type DisplayLabel<Item, Plugins extends AnyPlugins = AnyPlugins> = (
	cell: DisplayBodyCell<Item, Plugins>,
	state: TableState<Item, Plugins>
) => RenderConfig;

// If the function type is removed from the union, generics will not be
// inferred for subtypes.
export type HeaderLabel<Item, Plugins extends AnyPlugins = AnyPlugins> =
	| RenderConfig
	| ((cell: HeaderCell<Item, Plugins>, state: TableState<Item, Plugins>) => RenderConfig);
