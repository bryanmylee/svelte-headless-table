import type { UseTablePlugin } from '$lib/types/UseTablePlugin';
import { derived, writable, type Writable } from 'svelte/store';

/**
 * `PluginState` will be exposed to the user as controls for the plugin.
 * `PluginState` should be `Writable` or contain `Writable`s.
 */
export interface ColumnOrderState {
	columnIdOrder: Writable<string[]>;
}

/**
 * `PluginPropSet` describes data passed into each table component.
 */
export interface ColumnOrderPropSet {
	'thead.tr': never;
	'thead.tr.th': never;
	'tbody.tr': never;
	'tbody.tr.td': never;
}

export const useColumnOrder = <Item>(): UseTablePlugin<
	Item,
	{
		PluginState: ColumnOrderState;
		ColumnOptions: never;
		TablePropSet: ColumnOrderPropSet;
	}
> => {
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
