import type { UseTablePlugin } from '$lib/types/plugin';
import { derived, writable, type Writable } from 'svelte/store';

/**
 * `PluginState` will be exposed to the user as controls for the plugin.
 * `PluginState` should be `Writable` or contain `Writable`s.
 */
export interface HiddenColumnsState {
	hiddenColumnIds: Writable<Array<string>>;
}

/**
 * `PluginExtraPropSet` describes data passed into each table component.
 */
export interface HiddenColumnsExtraPropSet {
	'thead.tr': never;
	'thead.tr.th': {
		hidden: boolean;
	};
}

export const useHiddenColumns = <Item>(): UseTablePlugin<
	Item,
	HiddenColumnsState,
	HiddenColumnsExtraPropSet
> => {
	const hiddenColumnIds = writable<Array<string>>([]);

	const pluginState: HiddenColumnsState = { hiddenColumnIds };

	const flatColumnIdFn = derived(hiddenColumnIds, ($hiddenColumnIds) => {
		return (ids: Array<string>) => {
			return ids.filter((id) => !$hiddenColumnIds.includes(id));
		};
	});

	return {
		pluginState,
		flatColumnIdFn,
	};
};
