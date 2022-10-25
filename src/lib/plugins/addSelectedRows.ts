import type { BodyRow } from '../bodyRows';
import type { NewTablePropSet, TablePlugin } from '../types/TablePlugin';
import { nonNull } from '../utils/filter';
import { recordSetStore, type RecordSetStore } from '../utils/store';
import { derived, get, type Readable, type Updater, type Writable } from 'svelte/store';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SelectedRowsConfig<Item> {
	initialSelectedDataIds?: Record<string, boolean>;
	linkDataSubRows?: boolean;
}

export interface SelectedRowsState<Item> {
	selectedDataIds: RecordSetStore<string>;
	allRowsSelected: Writable<boolean>;
	someRowsSelected: Readable<boolean>;
	allPageRowsSelected: Writable<boolean>;
	somePageRowsSelected: Readable<boolean>;
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
		isSomeSubRowsSelectedForRow(subRow, $selectedDataIds, linkDataSubRows)
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
	({ tableState }) => {
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

		// all rows
		const _allRowsSelected = derived(
			[tableState.rows, selectedDataIds],
			([$rows, $selectedDataIds]) => {
				return $rows.every((row) => {
					if (!row.isData()) {
						return true;
					}
					return $selectedDataIds[row.dataId] === true;
				});
			}
		);
		const setAllRowsSelected = ($allRowsSelected: boolean) => {
			if ($allRowsSelected) {
				const $rows = get(tableState.rows);
				const allDataIds = $rows.map((row) => (row.isData() ? row.dataId : null)).filter(nonNull);
				selectedDataIds.addAll(allDataIds);
			} else {
				selectedDataIds.clear();
			}
		};
		const allRowsSelected: Writable<boolean> = {
			subscribe: _allRowsSelected.subscribe,
			update(fn) {
				const $allRowsSelected = get(_allRowsSelected);
				setAllRowsSelected(fn($allRowsSelected));
			},
			set: setAllRowsSelected,
		};

		const someRowsSelected = derived(
			[tableState.rows, selectedDataIds],
			([$rows, $selectedDataIds]) => {
				return $rows.some((row) => {
					if (!row.isData()) {
						return false;
					}
					return $selectedDataIds[row.dataId] === true;
				});
			}
		);

		// page rows
		const _allPageRowsSelected = derived(
			[tableState.pageRows, selectedDataIds],
			([$pageRows, $selectedDataIds]) => {
				return $pageRows.every((row) => {
					if (!row.isData()) {
						return true;
					}
					return $selectedDataIds[row.dataId] === true;
				});
			}
		);
		const setAllPageRowsSelected = ($allPageRowsSelected: boolean) => {
			const $pageRows = get(tableState.pageRows);
			const pageDataIds = $pageRows
				.map((row) => (row.isData() ? row.dataId : null))
				.filter(nonNull);
			if ($allPageRowsSelected) {
				selectedDataIds.addAll(pageDataIds);
			} else {
				selectedDataIds.removeAll(pageDataIds);
			}
		};
		const allPageRowsSelected: Writable<boolean> = {
			subscribe: _allPageRowsSelected.subscribe,
			update(fn) {
				const $allPageRowsSelected = get(_allPageRowsSelected);
				setAllPageRowsSelected(fn($allPageRowsSelected));
			},
			set: setAllPageRowsSelected,
		};

		const somePageRowsSelected = derived(
			[tableState.pageRows, selectedDataIds],
			([$pageRows, $selectedDataIds]) => {
				return $pageRows.some((row) => {
					if (!row.isData()) {
						return false;
					}
					return $selectedDataIds[row.dataId] === true;
				});
			}
		);

		const pluginState = {
			selectedDataIds,
			getRowState,
			allRowsSelected,
			someRowsSelected,
			allPageRowsSelected,
			somePageRowsSelected,
		};

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
