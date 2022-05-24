import { DataBodyRow, type BodyRow } from '$lib/bodyRows';
import type { NewTablePropSet, TablePlugin } from '$lib/types/TablePlugin';
import { recordSetStore, type RecordSetStore } from '$lib/utils/store';
import { keyed } from 'svelte-keyed';
import { derived, type Readable, type Updater, type Writable } from 'svelte/store';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SelectedRowsConfig<Item> {
	initialSelectedDataIds?: Record<string, boolean>;
}

export interface SelectedRowsState<Item> {
	selectedDataIds: RecordSetStore<string>;
	getRowState: (row: BodyRow<Item>) => SelectedRowsRowState;
}

export interface SelectedRowsRowState {
	isSelected: Writable<boolean>;
	isSomeSubRowsSelected: Readable<boolean>;
	isAllSubRowsSelected: Readable<boolean>;
}

export type SelectedRowsPropSet = NewTablePropSet<{
	'tbody.tr': {
		selected: boolean;
		someSubRowsSelected: boolean;
		allSubRowsSelected: boolean;
	};
}>;

const isAllSubRowsSelectedForRow = <Item>(
	row: BodyRow<Item>,
	$selectedDataIds: Record<string, boolean>
): boolean => {
	if (row instanceof DataBodyRow) {
		return $selectedDataIds[row.dataId] === true;
	}
	if (row.subRows === undefined) {
		return false;
	}
	return row.subRows.every((subRow) => isAllSubRowsSelectedForRow(subRow, $selectedDataIds));
};

const isSomeSubRowsSelectedForRow = <Item>(
	row: BodyRow<Item>,
	$selectedDataIds: Record<string, boolean>
): boolean => {
	if (row instanceof DataBodyRow) {
		return $selectedDataIds[row.dataId] === true;
	}
	if (row.subRows === undefined) {
		return false;
	}
	return row.subRows.some((subRow) => isAllSubRowsSelectedForRow(subRow, $selectedDataIds));
};

const updateSelectedDataIds = <Item>(
	row: BodyRow<Item>,
	value: boolean,
	$selectedDataIds: Record<string, boolean>
): void => {
	if (row instanceof DataBodyRow) {
		$selectedDataIds[row.dataId] = value;
	}
	if (row.subRows === undefined) {
		return;
	}
	row.subRows.forEach((subRow) => {
		updateSelectedDataIds(subRow, value, $selectedDataIds);
	});
};

const getIsSelectedStoreForDisplayRow = <Item>(
	row: BodyRow<Item>,
	selectedDataIds: RecordSetStore<string>
): Writable<boolean> => {
	const { subscribe } = derived(selectedDataIds, ($selectedDataIds) =>
		isAllSubRowsSelectedForRow(row, $selectedDataIds)
	);
	const update = (fn: Updater<boolean>) => {
		selectedDataIds.update(($selectedDataIds) => {
			const oldValue = isAllSubRowsSelectedForRow(row, $selectedDataIds);
			const $updatedSelectedDataIds = { ...$selectedDataIds };
			updateSelectedDataIds(row, fn(oldValue), $updatedSelectedDataIds);
			return $updatedSelectedDataIds;
		});
	};
	const set = (value: boolean) => update(() => value);
	return {
		subscribe,
		update,
		set,
	};
};

export const addSelectedRows =
	<Item>({ initialSelectedDataIds = {} }: SelectedRowsConfig<Item> = {}): TablePlugin<
		Item,
		SelectedRowsState<Item>,
		Record<string, never>,
		SelectedRowsPropSet
	> =>
	() => {
		const selectedDataIds = recordSetStore(initialSelectedDataIds);

		const getRowState = (row: BodyRow<Item>): SelectedRowsRowState => {
			const isSelected =
				row instanceof DataBodyRow
					? keyed(selectedDataIds, row.dataId)
					: getIsSelectedStoreForDisplayRow(row, selectedDataIds);
			const isSomeSubRowsSelected = derived(
				[isSelected, selectedDataIds],
				([$isSelected, $selectedDataIds]) => {
					if ($isSelected) return false;
					return isSomeSubRowsSelectedForRow(row, $selectedDataIds);
				}
			);
			const isAllSubRowsSelected = derived(selectedDataIds, ($selectedDataIds) => {
				return isAllSubRowsSelectedForRow(row, $selectedDataIds);
			});
			return {
				isSelected,
				isSomeSubRowsSelected,
				isAllSubRowsSelected,
			};
		};

		const pluginState = { selectedDataIds, getRowState };

		return {
			pluginState,
			hooks: {
				'tbody.tr': (row) => {
					const props = derived(selectedDataIds, ($selectedDataIds) => {
						const someSubRowsSelected = isSomeSubRowsSelectedForRow(row, $selectedDataIds);
						const allSubRowsSelected = isAllSubRowsSelectedForRow(row, $selectedDataIds);
						const selected =
							row instanceof DataBodyRow
								? $selectedDataIds[row.dataId] === true
								: allSubRowsSelected;
						return {
							selected,
							someSubRowsSelected,
							allSubRowsSelected,
						};
					});
					return { props };
				},
			},
		};
	};
