import type { RenderConfig } from 'svelte-render/createRender';
import type { DataBodyCell, DisplayBodyCell } from '../bodyCells.js';
import type { TableState } from '../createViewModel.js';
import type { HeaderCell } from '../headerCells.js';
import type { AnyPlugins } from './TablePlugin.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataLabel<Item, Plugins extends AnyPlugins = AnyPlugins, Value = any> = (
	cell: DataBodyCell<Item, AnyPlugins, Value>,
	state: TableState<Item, Plugins>
) => RenderConfig;

export type DisplayLabel<Item, Plugins extends AnyPlugins = AnyPlugins> = (
	cell: DisplayBodyCell<Item>,
	state: TableState<Item, Plugins>
) => RenderConfig;

// If the function type is removed from the union, generics will not be
// inferred for subtypes.
export type HeaderLabel<Item, Plugins extends AnyPlugins = AnyPlugins> =
	| RenderConfig
	| ((cell: HeaderCell<Item>, state: TableState<Item, Plugins>) => RenderConfig);
