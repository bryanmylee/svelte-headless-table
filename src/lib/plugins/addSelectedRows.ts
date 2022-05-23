import type { BodyRow } from '$lib/bodyRows';
import type { NewTablePropSet, TablePlugin } from '$lib/types/TablePlugin';
import { recordSetStore, type RecordSetStore } from '$lib/utils/store';
import { keyed } from 'svelte-keyed';
import { derived, type Readable, type Writable } from 'svelte/store';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SelectedRowsConfig<Item> {
	initialSelectedIds?: Record<string, boolean>;
}

export interface SelectedRowsState<Item> {
	selectedIds: RecordSetStore<string>;
	getRowState: (row: BodyRow<Item>) => SelectedRowsRowState;
}

export interface SelectedRowsRowState {
	isSelected: Writable<boolean>;
	isAllSubRowsSelected: Readable<boolean>;
}

export type SelectedRowsPropSet = NewTablePropSet<{
	'tbody.tr': {
		selected: boolean;
		allSubRowsSelected: boolean;
	};
}>;

export const addSelectedRows =
	<Item>({ initialSelectedIds = {} }: SelectedRowsConfig<Item> = {}): TablePlugin<
		Item,
		SelectedRowsState<Item>,
		Record<string, never>,
		SelectedRowsPropSet
	> =>
	() => {
		const selectedIds = recordSetStore(initialSelectedIds);
		const getRowState = (row: BodyRow<Item>): SelectedRowsRowState => {
			const isSelected = keyed(selectedIds, row.id) as Writable<boolean>;
			const subRowSelectedIds = derived(selectedIds, ($selectedIds) => {
				// Check prefix with '>' to match child ids while ignoring this row's id.
				return Object.entries($selectedIds).filter(
					([id, selected]) => id.startsWith(`${row.id}>`) && selected
				);
			});
			const isAllSubRowsSelected = derived(subRowSelectedIds, ($subRowSelectedIds) => {
				if (row.subRows === undefined) {
					return true;
				}
				return $subRowSelectedIds.length === row.subRows.length;
			});
			return {
				isSelected,
				isAllSubRowsSelected,
			};
		};
		const pluginState = { selectedIds, getRowState };

		return {
			pluginState,
			hooks: {
				'tbody.tr': (row) => {
					const props = derived(selectedIds, ($selectedIds) => {
						const selected = $selectedIds[row.id] === true;
						const subRowSelectedIds = Object.entries($selectedIds).filter(
							([id, selected]) => id.startsWith(`${row.id}>`) && selected
						);
						const allSubRowsSelected =
							row.subRows === undefined || subRowSelectedIds.length === row.subRows?.length;
						return {
							selected,
							allSubRowsSelected,
						};
					});
					return { props };
				},
			},
		};
	};
