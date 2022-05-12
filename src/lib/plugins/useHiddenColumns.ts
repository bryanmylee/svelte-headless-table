import type { DeriveFlatColumnsFn, NewTablePropSet, TablePlugin } from '$lib/types/TablePlugin';
import { derived, writable, type Writable } from 'svelte/store';

export interface HiddenColumnsConfig {
	initialHiddenColumnIds?: string[];
}

export interface HiddenColumnsState {
	hiddenColumnIds: Writable<string[]>;
}

export const useHiddenColumns =
	<Item>({ initialHiddenColumnIds = [] }: HiddenColumnsConfig = {}): TablePlugin<
		Item,
		HiddenColumnsState,
		Record<string, never>,
		NewTablePropSet<never>
	> =>
	() => {
		const hiddenColumnIds = writable<string[]>(initialHiddenColumnIds);

		const pluginState: HiddenColumnsState = { hiddenColumnIds };

		const deriveFlatColumns: DeriveFlatColumnsFn<Item> = (flatColumns) => {
			return derived([flatColumns, hiddenColumnIds], ([$flatColumns, $hiddenColumnIds]) => {
				if ($hiddenColumnIds.length === 0) {
					return $flatColumns;
				}
				return $flatColumns.filter((c) => !$hiddenColumnIds.includes(c.id));
			});
		};

		return {
			pluginState,
			deriveFlatColumns,
		};
	};
