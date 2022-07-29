import type { BodyRow } from '$lib/bodyRows';
import type { DataColumn, FlatColumn } from '$lib/columns';
import type { TableState } from '$lib/createViewModel';
import type { RenderConfig } from '$lib/render';
import type { AnyPlugins } from './TablePlugin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataLabel<Item, Plugins extends AnyPlugins = AnyPlugins, Value = any> = (
	props: DataLabelProps<Item, Plugins, Value>,
	state: TableState<Item, Plugins>
) => RenderConfig;

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export type DataLabelProps<Item, Plugins extends AnyPlugins = AnyPlugins, Value = any> = {
	column: DataColumn<Item, Plugins>;
	row: BodyRow<Item, Plugins>;
	// Value type does not infer correctly in Svelte
	// value: Value;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any;
};

export type DisplayLabel<Item, Plugins extends AnyPlugins = AnyPlugins> = (
	props: DisplayLabelProps<Item, Plugins>,
	state: TableState<Item, Plugins>
) => RenderConfig;

export type DisplayLabelProps<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	column: FlatColumn<Item, Plugins>;
	row: BodyRow<Item, Plugins>;
};

// If the function type is removed from the union, generics will not be
// inferred for subtypes.
export type HeaderLabel<Item, Plugins extends AnyPlugins = AnyPlugins> =
	| RenderConfig
	| ((state: TableState<Item, Plugins>) => RenderConfig);
