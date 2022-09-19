import { DataBodyCell } from '$lib/bodyCells';
import { BodyRow, DisplayBodyRow } from '$lib/bodyRows';
import type { DataColumn } from '$lib/columns';
import type { DataLabel } from '$lib/types/Label';
import type { DeriveRowsFn, NewTablePropSet, TablePlugin } from '$lib/types/TablePlugin';
import { isShiftClick } from '$lib/utils/event';
import { nonUndefined } from '$lib/utils/filter';
import { arraySetStore, type ArraySetStore } from '$lib/utils/store';
import { derived, writable, type Readable } from 'svelte/store';

export interface GroupByConfig {
	initialGroupByIds?: string[];
	disableMultiGroup?: boolean;
	isMultiGroupEvent?: (event: Event) => boolean;
}

export interface GroupByState {
	groupByIds: ArraySetStore<string>;
}

export interface GroupByColumnOptions<
	Item,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Value = any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	GroupOn extends string | number = any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Aggregate = any
> {
	disable?: boolean;
	getAggregateValue?: (values: GroupOn[]) => Aggregate;
	getGroupOn?: (value: Value) => GroupOn;
	cell?: DataLabel<Item>;
}

export type GroupByPropSet = NewTablePropSet<{
	'thead.tr.th': {
		grouped: boolean;
		toggle: (event: Event) => void;
		clear: () => void;
		disabled: boolean;
	};
	'tbody.tr.td': {
		repeated: boolean;
		aggregated: boolean;
		grouped: boolean;
	};
}>;

interface GetGroupedRowsProps {
	repeatCellIds: Record<string, boolean>;
	aggregateCellIds: Record<string, boolean>;
	groupCellIds: Record<string, boolean>;
	allGroupByIds: string[];
}

const getIdPrefix = (id: string): string => {
	const prefixTokens = id.split('>').slice(0, -1);
	if (prefixTokens.length === 0) {
		return '';
	}
	return `${prefixTokens.join('>')}>`;
};

const getIdLeaf = (id: string): string => {
	const tokens = id.split('>');
	return tokens[tokens.length - 1] ?? '';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGroupedRows = <
	Item,
	Row extends BodyRow<Item>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	GroupOn extends string | number = any
>(
	rows: Row[],
	groupByIds: string[],
	columnOptions: Record<string, GroupByColumnOptions<Item>>,
	{ repeatCellIds, aggregateCellIds, groupCellIds, allGroupByIds }: GetGroupedRowsProps
): Row[] => {
	if (groupByIds.length === 0) {
		return rows;
	}
	if (rows.length === 0) {
		return rows;
	}
	const idPrefix = getIdPrefix(rows[0].id);
	const [groupById, ...restIds] = groupByIds;

	const subRowsForGroupOnValue = new Map<GroupOn, Row[]>();
	for (const row of rows) {
		const cell = row.cellForId[groupById];
		if (!cell.isData()) {
			break;
		}
		const columnOption = columnOptions[groupById] ?? {};
		const { getGroupOn } = columnOption;
		const groupOnValue = getGroupOn?.(cell.value) ?? cell.value;
		if (typeof groupOnValue === 'function' || typeof groupOnValue === 'object') {
			console.warn(
				`Missing \`getGroupOn\` column option to aggregate column "${groupById}" with object values`
			);
		}
		const subRows = subRowsForGroupOnValue.get(groupOnValue) ?? [];
		subRowsForGroupOnValue.set(groupOnValue, [...subRows, row]);
	}

	const groupedRows: Row[] = [];
	let groupRowIdx = 0;
	for (const [groupOnValue, subRows] of subRowsForGroupOnValue.entries()) {
		// Guaranteed to have at least one subRow.
		const firstRow = subRows[0];
		const groupRow = new DisplayBodyRow<Item>({
			id: `${idPrefix}${groupRowIdx++}`,
			// TODO Differentiate data rows and grouped rows.
			depth: firstRow.depth,
			cells: [],
			cellForId: {},
		});
		const groupRowCellForId = Object.fromEntries(
			Object.entries(firstRow.cellForId).map(([id, cell]) => {
				if (id === groupById) {
					const newCell = new DataBodyCell({
						column: cell.column as DataColumn<Item>,
						row: groupRow,
						value: groupOnValue,
					});
					return [id, newCell];
				}
				const columnCells = subRows.map((row) => row.cellForId[id]).filter(nonUndefined);
				if (!columnCells[0].isData()) {
					const clonedCell = columnCells[0].clone();
					clonedCell.row = groupRow;
					return [id, clonedCell];
				}
				const { cell: label, getAggregateValue } = columnOptions[id] ?? {};
				const columnValues = (columnCells as DataBodyCell<Item>[]).map((cell) => cell.value);
				const value = getAggregateValue === undefined ? '' : getAggregateValue(columnValues);
				const newCell = new DataBodyCell({
					column: cell.column as DataColumn<Item>,
					row: groupRow,
					value,
					label,
				});
				return [id, newCell];
			})
		);
		const groupRowCells = firstRow.cells.map((cell) => {
			return groupRowCellForId[cell.id];
		});
		groupRow.cellForId = groupRowCellForId;
		groupRow.cells = groupRowCells;
		const groupRowSubRows = subRows.map((subRow) => {
			const clonedRow = subRow.clone({ includeCells: true });
			clonedRow.id = `${groupRow.id}>${getIdLeaf(subRow.id)}`;
			clonedRow.depth = subRow.depth + 1;
			return clonedRow;
		});
		groupRow.subRows = getGroupedRows(groupRowSubRows, restIds, columnOptions, {
			repeatCellIds,
			aggregateCellIds,
			groupCellIds,
			allGroupByIds,
		});
		groupedRows.push(groupRow as unknown as Row);
		groupRow.cells.forEach((cell) => {
			if (cell.id === groupById) {
				groupCellIds[cell.rowColId()] = true;
			} else {
				aggregateCellIds[cell.rowColId()] = true;
			}
		});
		groupRow.subRows.forEach((subRow) => {
			subRow.parentRow = groupRow;
			subRow.cells.forEach((cell) => {
				if (allGroupByIds.includes(cell.id) && groupCellIds[cell.rowColId()] !== true) {
					repeatCellIds[cell.rowColId()] = true;
				}
			});
		});
	}
	return groupedRows;
};

export const addGroupBy =
	<Item>({
		initialGroupByIds = [],
		disableMultiGroup = false,
		isMultiGroupEvent = isShiftClick,
	}: GroupByConfig = {}): TablePlugin<
		Item,
		GroupByState,
		GroupByColumnOptions<Item>,
		GroupByPropSet
	> =>
	({ columnOptions }) => {
		const disabledGroupIds = Object.entries(columnOptions)
			.filter(([, option]) => option.disable === true)
			.map(([columnId]) => columnId);

		const groupByIds = arraySetStore(initialGroupByIds);

		const repeatCellIds = writable<Record<string, boolean>>({});
		const aggregateCellIds = writable<Record<string, boolean>>({});
		const groupCellIds = writable<Record<string, boolean>>({});

		const pluginState: GroupByState = {
			groupByIds,
		};

		const deriveRows: DeriveRowsFn<Item> = (rows) => {
			return derived([rows, groupByIds], ([$rows, $groupByIds]) => {
				const $repeatCellIds = {};
				const $aggregateCellIds = {};
				const $groupCellIds = {};
				const $groupedRows = getGroupedRows($rows, $groupByIds, columnOptions, {
					repeatCellIds: $repeatCellIds,
					aggregateCellIds: $aggregateCellIds,
					groupCellIds: $groupCellIds,
					allGroupByIds: $groupByIds,
				});
				repeatCellIds.set($repeatCellIds);
				aggregateCellIds.set($aggregateCellIds);
				groupCellIds.set($groupCellIds);
				return $groupedRows;
			});
		};

		return {
			pluginState,
			deriveRows,
			hooks: {
				'thead.tr.th': (cell) => {
					const disabled = disabledGroupIds.includes(cell.id) || !cell.isData();
					const props = derived(groupByIds, ($groupByIds) => {
						const grouped = $groupByIds.includes(cell.id);
						const toggle = (event: Event) => {
							if (!cell.isData()) return;
							if (disabled) return;
							groupByIds.toggle(cell.id, {
								clearOthers: disableMultiGroup || !isMultiGroupEvent(event),
							});
						};
						const clear = () => {
							groupByIds.remove(cell.id);
						};
						return {
							grouped,
							toggle,
							clear,
							disabled,
						};
					});
					return { props };
				},
				'tbody.tr.td': (cell) => {
					const props: Readable<GroupByPropSet['tbody.tr.td']> = derived(
						[repeatCellIds, aggregateCellIds, groupCellIds],
						([$repeatCellIds, $aggregateCellIds, $groupCellIds]) => {
							return {
								repeated: $repeatCellIds[cell.rowColId()] === true,
								aggregated: $aggregateCellIds[cell.rowColId()] === true,
								grouped: $groupCellIds[cell.rowColId()] === true,
							};
						}
					);
					return { props };
				},
			},
		};
	};
