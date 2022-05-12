import type { DataColumn } from '$lib/columns';
import type { NewTablePropSet, TablePlugin } from '$lib/types/TablePlugin';
import { derived, writable, type Writable } from 'svelte/store';

export interface ColumnOrderConfig {
	initialColumnIdOrder?: string[];
	hideUnspecifiedColumns?: boolean;
}

export interface ColumnOrderState {
	columnIdOrder: Writable<string[]>;
}

export const useColumnOrder =
	<Item>({
		initialColumnIdOrder = [],
		hideUnspecifiedColumns = false,
	}: ColumnOrderConfig = {}): TablePlugin<
		Item,
		ColumnOrderState,
		Record<string, never>,
		NewTablePropSet<never>
	> =>
	() => {
		const columnIdOrder = writable<string[]>(initialColumnIdOrder);

		const pluginState: ColumnOrderState = { columnIdOrder };

		const transformFlatColumnsFn = derived(columnIdOrder, ($columnIdOrder) => {
			return (flatColumns: DataColumn<Item>[]) => {
				const flatColumnsCopy = [...flatColumns];
				const orderedFlatColumns: DataColumn<Item>[] = [];
				$columnIdOrder.forEach((id) => {
					const colIdx = flatColumnsCopy.findIndex((c) => c.id === id);
					orderedFlatColumns.push(...flatColumnsCopy.splice(colIdx, 1));
				});
				if (!hideUnspecifiedColumns) {
					// Push the remaining unspecified columns.
					orderedFlatColumns.push(...flatColumnsCopy);
				}
				return orderedFlatColumns;
			};
		});

		return {
			pluginState,
			transformFlatColumnsFn,
		};
	};
