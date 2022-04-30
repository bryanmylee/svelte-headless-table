import type { UseTablePlugin } from '$lib/types/plugin';
import { derived, writable, type Writable } from 'svelte/store';

export interface ColumnOrderConfig {
	initialOrder?: Array<string>;
}

/**
 * `PluginState` will be exposed to the user as controls for the plugin.
 * `PluginState` should be `Writable` or contain `Writable`s.
 */
export interface ColumnOrderState {
	columnOrder: Writable<Array<string>>;
}

/**
 * `PluginExtraPropSet` describes data passed into each table component.
 */
export interface ColumnOrderExtraPropSet {
	'thead.tr': never;
	'thead.tr.th': never;
}

export const useColumnOrder = <Item>({ initialOrder = [] }: ColumnOrderConfig = {}): UseTablePlugin<
	Item,
	ColumnOrderState,
	ColumnOrderExtraPropSet
> => {
	const columnOrder = writable<Array<string>>(initialOrder);

	const pluginState: ColumnOrderState = { columnOrder };

	const flatColumnIdFn = derived(columnOrder, ($columnOrder) => {
		return (ids: Array<string>) => {
			const originalIds = [...ids];
			let orderedIds: Array<string> = [];
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
		flatColumnIdFn,
	};
};
