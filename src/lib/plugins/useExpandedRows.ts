import { BodyRow, getSubRows } from '$lib/bodyRows';
import type { DeriveRowsFn, NewTablePropSet, TablePlugin } from '$lib/types/TablePlugin';
import { keyed } from 'svelte-keyed';
import { derived, writable, type Writable } from 'svelte/store';

export type ValidChildrenKey<Item> = {
	[Key in keyof Item]: Item[Key] extends Item[] ? Key : never;
}[keyof Item];

export type ValidChildrenFn<Item> = (item: Item) => Item[] | undefined;

export interface ExpandedRowsConfig<Item> {
	children: ValidChildrenKey<Item> | ValidChildrenFn<Item>;
	initialExpandedIds?: Record<string, boolean>;
}

export interface ExpandedRowsState<Item> {
	expandedIds: Writable<Record<string, boolean>>;
	getRowState: (row: BodyRow<Item>) => ExpandedRowsRowState;
}

export interface ExpandedRowsRowState {
	isExpanded: Writable<boolean>;
}

export const useExpandedRows =
	<Item>({
		children: subRows,
		initialExpandedIds = {},
	}: ExpandedRowsConfig<Item>): TablePlugin<
		Item,
		ExpandedRowsState<Item>,
		Record<string, never>,
		NewTablePropSet<never>
	> =>
	() => {
		const expandedIds = writable(initialExpandedIds);
		const getRowState = (row: BodyRow<Item>): ExpandedRowsRowState => {
			const isExpanded = keyed(expandedIds, row.id) as Writable<boolean>;
			return {
				isExpanded,
			};
		};
		const pluginState = { expandedIds, getRowState };

		const getChildren: ValidChildrenFn<Item> =
			subRows instanceof Function ? subRows : (item) => item[subRows] as unknown as Item[];

		const deriveRows: DeriveRowsFn<Item> = (rows) => {
			return derived([rows, expandedIds], ([$rows, $expandedIds]) => {
				return $rows.flatMap((row) => {
					if ($expandedIds[row.id] !== true) {
						return [row];
					}
					const subItems = getChildren(row.original);
					if (subItems === undefined) {
						return [row];
					}
					return [row, ...(getSubRows(subItems, row) as typeof row[])];
				});
			});
		};

		return {
			pluginState,
			deriveRows,
		};
	};
