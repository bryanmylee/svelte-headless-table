import type { DataColumn } from '$lib/columns';
import type { NewTablePropSet, UseTablePlugin } from '$lib/types/UseTablePlugin';
import { derived, writable, type Writable } from 'svelte/store';

export interface HiddenColumnsConfig {
	initialHiddenColumnIds?: string[];
}

export interface HiddenColumnsState {
	hiddenColumnIds: Writable<string[]>;
}

export type HiddenColumnsPropSet = NewTablePropSet<{
	'thead.tr.th': {
		hidden: boolean;
	};
}>;

export const useHiddenColumns =
	<Item>({ initialHiddenColumnIds = [] }: HiddenColumnsConfig = {}): UseTablePlugin<
		Item,
		{
			PluginState: HiddenColumnsState;
			ColumnOptions: never;
			TablePropSet: HiddenColumnsPropSet;
		}
	> =>
	() => {
		const hiddenColumnIds = writable<string[]>(initialHiddenColumnIds);

		const pluginState: HiddenColumnsState = { hiddenColumnIds };

		const transformFlatColumnsFn = derived(hiddenColumnIds, ($hiddenColumnIds) => {
			return (flatColumns: DataColumn<Item>[]) => {
				if ($hiddenColumnIds.length === 0) {
					return flatColumns;
				}
				return flatColumns.filter((c) => !$hiddenColumnIds.includes(c.id));
			};
		});

		return {
			pluginState,
			transformFlatColumnsFn,
		};
	};
