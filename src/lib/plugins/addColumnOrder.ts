import type { DeriveFlatColumnsFn, NewTablePropSet, TablePlugin } from '$lib/types/TablePlugin';
import { derived, writable, type Writable } from 'svelte/store';

export interface ColumnOrderConfig {
	initialColumnIdOrder?: string[];
	hideUnspecifiedColumns?: boolean;
}

export interface ColumnOrderState {
	columnIdOrder: Writable<string[]>;
}

export const addColumnOrder =
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

		const deriveFlatColumns: DeriveFlatColumnsFn<Item> = (flatColumns) => {
			return derived([flatColumns, columnIdOrder], ([$flatColumns, $columnIdOrder]) => {
				const _flatColumns = [...$flatColumns];
				const orderedFlatColumns: typeof $flatColumns = [];
				$columnIdOrder.forEach((id) => {
					const colIdx = _flatColumns.findIndex((c) => c.id === id);
					orderedFlatColumns.push(..._flatColumns.splice(colIdx, 1));
				});
				if (!hideUnspecifiedColumns) {
					// Push the remaining unspecified columns.
					orderedFlatColumns.push(..._flatColumns);
				}
				return orderedFlatColumns;
			});
		};

		return {
			pluginState,
			deriveFlatColumns,
		};
	};
