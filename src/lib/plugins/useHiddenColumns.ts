import type { NewTablePropSet, UseTablePlugin } from '$lib/types/UseTablePlugin';
import { derived, writable, type Writable } from 'svelte/store';

export interface HiddenColumnsState {
	hiddenColumnIds: Writable<string[]>;
}

export type HiddenColumnsPropSet = NewTablePropSet<{
	'thead.tr.th': {
		hidden: boolean;
	};
}>;

export const useHiddenColumns =
	<Item>(): UseTablePlugin<
		Item,
		{
			PluginState: HiddenColumnsState;
			ColumnOptions: never;
			TablePropSet: HiddenColumnsPropSet;
		}
	> =>
	() => {
		const hiddenColumnIds = writable<string[]>([]);

		const pluginState: HiddenColumnsState = { hiddenColumnIds };

		const visibleColumnIdsFn = derived(hiddenColumnIds, ($hiddenColumnIds) => {
			return (ids: string[]) => {
				return ids.filter((id) => !$hiddenColumnIds.includes(id));
			};
		});

		return {
			pluginState,
			visibleColumnIdsFn,
		};
	};
