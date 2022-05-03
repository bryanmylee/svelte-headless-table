import type { AnyPlugins } from '$lib/useTable';
import type { ComponentKeys } from './ComponentKeys';
import type { UseTablePlugin } from './UseTablePlugin';

export type PluginStates<Plugins extends AnyPlugins> = {
	[K in keyof Plugins]: Plugins[K]['pluginState'];
};

type TablePropSetForPluginKey<Plugins extends AnyPlugins> = {
	[K in keyof Plugins]: Plugins[K] extends UseTablePlugin<unknown, unknown, infer E> ? E : never;
};

export type PluginTablePropSet<Plugins extends AnyPlugins> = {
	[ComponentKey in ComponentKeys]: {
		[PluginKey in keyof Plugins]: TablePropSetForPluginKey<Plugins>[PluginKey][ComponentKey];
	};
};
