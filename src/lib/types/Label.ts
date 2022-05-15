import type { TableState } from '$lib/createViewModel';
import type { RenderConfig } from '$lib/render';
import type { AnyPlugins } from './TablePlugin';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DataLabel<Item, Value, Plugins extends AnyPlugins = AnyPlugins> = (
	value: Value,
	state: TableState<Item, Plugins>
) => RenderConfig;

export type DisplayLabel<Item, Plugins extends AnyPlugins = AnyPlugins> = (
	rowId: string,
	state: TableState<Item, Plugins>
) => RenderConfig;

// If the function type is removed from the union, generics will not be
// inferred for subtypes.
export type HeaderLabel<Item, Plugins extends AnyPlugins = AnyPlugins> =
	| RenderConfig
	| ((state: TableState<Item, Plugins>) => RenderConfig);
