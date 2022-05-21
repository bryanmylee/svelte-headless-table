import { DataBodyCell } from '$lib/bodyCells';
import { BodyRow } from '$lib/bodyRows';
import type { DataColumn } from '$lib/columns';
import type { DataLabel } from '$lib/types/Label';
import type { DeriveRowsFn, NewTablePropSet, TablePlugin } from '$lib/types/TablePlugin';
import { getCloned, getClonedRow } from '$lib/utils/clone';
import { isShiftClick } from '$lib/utils/event';
import { nonUndefined } from '$lib/utils/filter';
import { arraySetStore } from '$lib/utils/store';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface GroupByConfig {
	initialGroupByIds?: string[];
	disableMultiGroup?: boolean;
	isMultiGroupEvent?: (event: Event) => boolean;
}

export interface GroupByState {
	groupByIds: Writable<string[]>;
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
	};
	'tbody.tr.td': {
		repeated: boolean;
		aggregated: boolean;
		grouped: boolean;
	};
}>;

interface CellMetadata {
	repeatCellIds: Record<string, boolean>;
	aggregateCellIds: Record<string, boolean>;
	groupCellIds: Record<string, boolean>;
}

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
	{ repeatCellIds, aggregateCellIds, groupCellIds }: CellMetadata
): Row[] => {
	if (groupByIds.length === 0) {
		return rows;
	}
	const [groupById, ...restIds] = groupByIds;

	const subRowsForGroupOnValue = new Map<GroupOn, Row[]>();
	for (const row of rows) {
		const cell = row.cellForId[groupById];
		if (!(cell instanceof DataBodyCell)) {
			break;
		}
		const columnOption = columnOptions[groupById] ?? {};
		const { getGroupOn } = columnOption;
		const groupOnValue = getGroupOn === undefined ? cell.value : getGroupOn(cell.value);
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
		const groupRow = new BodyRow({
			id: `${groupRowIdx++}`,
			original: firstRow.original,
			depth: firstRow.depth,
			cells: [],
			cellForId: {},
		});
		const groupRowCells = firstRow.cells.map((cell) => {
			const { id } = cell.column;
			if (id === groupById) {
				return new DataBodyCell({
					column: cell.column as DataColumn<Item>,
					row: groupRow,
					value: groupOnValue,
				});
			}
			const columnCells = subRows.map((row) => row.cellForId[id]).filter(nonUndefined);
			if (!(columnCells[0] instanceof DataBodyCell)) {
				return getCloned(columnCells[0], {
					row: groupRow,
				});
			}
			const { cell: label, getAggregateValue } = columnOptions[id] ?? {};
			const columnValues = (columnCells as DataBodyCell<Item>[]).map((cell) => cell.value);
			const value = getAggregateValue === undefined ? '' : getAggregateValue(columnValues);
			return new DataBodyCell({
				column: cell.column as DataColumn<Item>,
				row: groupRow,
				value,
				label,
			});
		});
		groupRow.cells = groupRowCells;
		groupRow.subRows = subRows.map((subRow) => {
			return getClonedRow(subRow, {
				id: `${groupRow.id}>${subRow.id}`,
				depth: subRow.depth + 1,
			} as Partial<typeof subRow>);
		});
		groupedRows.push(groupRow as Row);
		groupRow.cells.forEach((cell) => {
			if (cell.id === groupById) {
				groupCellIds[cell.rowColId()] = true;
			} else {
				aggregateCellIds[cell.rowColId()] = true;
			}
		});
		groupRow.subRows.forEach((subRow) => {
			subRow.cells.forEach((cell) => {
				if (cell.id === groupById) {
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
					const disabled = disabledGroupIds.includes(cell.id);
					const props = derived(groupByIds, ($groupByIds) => {
						const grouped = $groupByIds.includes(cell.id);
						const toggle = (event: Event) => {
							if (!cell.isData) return;
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
