import type { NewTablePropSet, UseTablePlugin } from '$lib/types/UseTablePlugin';
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

		const visibleColumnIdsFn = derived(columnIdOrder, ($columnOrder) => {
			return (ids: string[]) => {
				const originalIds = [...ids];
				let orderedIds: string[] = [];
				$columnOrder.forEach((id) => {
					const index = originalIds.indexOf(id);
					if (index !== -1) {
						orderedIds.push(id);
						originalIds.splice(index, 1);
					}
				});
				orderedIds = [...orderedIds, ...originalIds];
				return orderedIds;
			};
		});

		return {
			pluginState,
			visibleColumnIdsFn,
		};
	};
