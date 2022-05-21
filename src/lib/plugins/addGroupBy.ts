import { DataBodyCell, DisplayBodyCell } from '$lib/bodyCells';
import { BodyRow } from '$lib/bodyRows';
import type { DataColumn } from '$lib/columns';
import type { DataLabel } from '$lib/types/Label';
import type { DeriveRowsFn, NewTablePropSet, TablePlugin } from '$lib/types/TablePlugin';
import { nonUndefined } from '$lib/utils/filter';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface GroupByConfig {
	initialGroupByIds?: string[];
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
	'tbody.tr.td': {
		isRepeat: boolean;
		isAggregate: boolean;
		isGroup: boolean;
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
			throw new Error(
				`Missing \`getGroupOn\` column option to aggregate column ${groupById} with object values`
			);
		}
		const subRows = subRowsForGroupOnValue.get(groupOnValue) ?? [];
		// TODO track which cells are repeat, aggregate, and group
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
			const firstColumnCell = columnCells[0];
			if (firstColumnCell instanceof DisplayBodyCell) {
				return new DisplayBodyCell({
					row: groupRow,
					column: firstColumnCell.column,
					label: firstColumnCell.label,
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
		// FIXME How do we get a copy of subRows and cells with updated depth and
		// id, while preserving the `cells` and `cellForId` relationships?
		// Temporarily modify the subRow properties in place.
		subRows.forEach((subRow) => {
			subRow.id = `${groupRow.id}>${subRow.id}`;
			subRow.depth = subRow.depth + 1;
		});
		groupRow.subRows = subRows;
		groupedRows.push(groupRow as Row);
		groupRow.cells.forEach((cell) => {
			if (cell.id === groupById) {
				groupCellIds[cell.rowColId()] = true;
			} else {
				aggregateCellIds[cell.rowColId()] = true;
			}
		});
		subRows.forEach((subRow) => {
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
	<Item>({ initialGroupByIds = [] }: GroupByConfig = {}): TablePlugin<
		Item,
		GroupByState,
		GroupByColumnOptions<Item>,
		GroupByPropSet
	> =>
	({ columnOptions }) => {
		const groupByIds = writable(initialGroupByIds);

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
				'tbody.tr.td': (cell) => {
					const props: Readable<GroupByPropSet['tbody.tr.td']> = derived(
						[repeatCellIds, aggregateCellIds, groupCellIds],
						([$repeatCellIds, $aggregateCellIds, $groupCellIds]) => {
							const p = {
								isRepeat: $repeatCellIds[cell.rowColId()] === true,
								isAggregate: $aggregateCellIds[cell.rowColId()] === true,
								isGroup: $groupCellIds[cell.rowColId()] === true,
							};
							return p;
						}
					);
					return { props };
				},
			},
		};
	};
