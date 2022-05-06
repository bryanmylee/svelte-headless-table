import type { DataColumn } from '$lib/columns';
import type { NewTablePropSet, UseTablePlugin } from '$lib/types/UseTablePlugin';
import { nonUndefined } from '$lib/utils/filter';
import { derived, writable, type Writable } from 'svelte/store';

export interface ColumnOrderState {
	columnIdOrder: Writable<string[]>;
}

export const useColumnOrder =
	<Item>(): UseTablePlugin<
		Item,
		{
			PluginState: ColumnOrderState;
			ColumnOptions: never;
			TablePropSet: NewTablePropSet<never>;
		}
	> =>
	() => {
		const columnIdOrder = writable<string[]>([]);

		const pluginState: ColumnOrderState = { columnIdOrder };

		const transformFlatColumnsFn = derived(columnIdOrder, ($columnIdOrder) => {
			return (flatColumns: DataColumn<Item>[]) => {
				if ($columnIdOrder.length === 0) {
					return flatColumns;
				}
				return $columnIdOrder
					.map((id) => flatColumns.find((c) => c.id === id))
					.filter(nonUndefined);
			};
		});

		return {
			pluginState,
			transformFlatColumnsFn,
		};
	};
