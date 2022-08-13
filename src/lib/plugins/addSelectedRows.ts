import type { BodyRow } from '$lib/bodyRows';
import type { NewTablePropSet, TablePlugin } from '$lib/types/TablePlugin';
import { recordSetStore, type RecordSetStore } from '$lib/utils/store';
import { derived, type Readable, type Updater, type Writable } from 'svelte/store';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SelectedRowsConfig<Item> {
	initialSelectedDataIds?: Record<string, boolean>;
	linkDataSubRows?: boolean;
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
	$selectedDataIds: Record<string, boolean>,
	linkDataSubRows: boolean
): boolean => {
	if (row.isData()) {
		if (!linkDataSubRows || row.subRows === undefined) {
			return $selectedDataIds[row.dataId] === true;
		}
	}
	if (row.subRows === undefined) {
		return false;
	}
	return row.subRows.every((subRow) =>
		isAllSubRowsSelectedForRow(subRow, $selectedDataIds, linkDataSubRows)
	);
};

const isSomeSubRowsSelectedForRow = <Item>(
	row: BodyRow<Item>,
	$selectedDataIds: Record<string, boolean>,
	linkDataSubRows: boolean
): boolean => {
	if (row.isData()) {
		if (!linkDataSubRows || row.subRows === undefined) {
			return $selectedDataIds[row.dataId] === true;
		}
	}
	if (row.subRows === undefined) {
		return false;
	}
	return row.subRows.some((subRow) =>
		isAllSubRowsSelectedForRow(subRow, $selectedDataIds, linkDataSubRows)
	);
};

const writeSelectedDataIds = <Item>(
	row: BodyRow<Item>,
	value: boolean,
	$selectedDataIds: Record<string, boolean>,
	linkDataSubRows: boolean
): void => {
	if (row.isData()) {
		$selectedDataIds[row.dataId] = value;
		if (!linkDataSubRows) {
			return;
		}
	}
	if (row.subRows === undefined) {
		return;
	}
	row.subRows.forEach((subRow) => {
		writeSelectedDataIds(subRow, value, $selectedDataIds, linkDataSubRows);
	});
};

const getRowIsSelectedStore = <Item>(
	row: BodyRow<Item>,
	selectedDataIds: RecordSetStore<string>,
	linkDataSubRows: boolean
): Writable<boolean> => {
	const { subscribe } = derived(selectedDataIds, ($selectedDataIds) => {
		if (row.isData()) {
			if (!linkDataSubRows) {
				return $selectedDataIds[row.dataId] === true;
			}
			if ($selectedDataIds[row.dataId] === true) {
				return true;
			}
		}
		return isAllSubRowsSelectedForRow(row, $selectedDataIds, linkDataSubRows);
	});
	const update = (fn: Updater<boolean>) => {
		selectedDataIds.update(($selectedDataIds) => {
			const oldValue = isAllSubRowsSelectedForRow(row, $selectedDataIds, linkDataSubRows);
			const $updatedSelectedDataIds = { ...$selectedDataIds };
			writeSelectedDataIds(row, fn(oldValue), $updatedSelectedDataIds, linkDataSubRows);
			if (row.parentRow !== undefined && row.parentRow.isData()) {
				$updatedSelectedDataIds[row.parentRow.dataId] = isAllSubRowsSelectedForRow(
					row.parentRow,
					$updatedSelectedDataIds,
					linkDataSubRows
				);
			}
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
	<Item>({
		initialSelectedDataIds = {},
		linkDataSubRows = true,
	}: SelectedRowsConfig<Item> = {}): TablePlugin<
		Item,
		SelectedRowsState<Item>,
		Record<string, never>,
		SelectedRowsPropSet
	> =>
	() => {
		const selectedDataIds = recordSetStore(initialSelectedDataIds);

		const getRowState = (row: BodyRow<Item>): SelectedRowsRowState => {
			const isSelected = getRowIsSelectedStore(row, selectedDataIds, linkDataSubRows);
			const isSomeSubRowsSelected = derived(
				[isSelected, selectedDataIds],
				([$isSelected, $selectedDataIds]) => {
					if ($isSelected) return false;
					return isSomeSubRowsSelectedForRow(row, $selectedDataIds, linkDataSubRows);
				}
			);
			const isAllSubRowsSelected = derived(selectedDataIds, ($selectedDataIds) => {
				return isAllSubRowsSelectedForRow(row, $selectedDataIds, linkDataSubRows);
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
						const someSubRowsSelected = isSomeSubRowsSelectedForRow(
							row,
							$selectedDataIds,
							linkDataSubRows
						);
						const allSubRowsSelected = isAllSubRowsSelectedForRow(
							row,
							$selectedDataIds,
							linkDataSubRows
						);
						const selected = row.isData()
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
