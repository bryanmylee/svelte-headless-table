import { DataBodyCell } from '$lib/bodyCells';
import { BodyRow } from '$lib/bodyRows';
import type { DataColumn } from '$lib/columns';
import type { DataLabel } from '$lib/types/Label';
import type { DeriveRowsFn, NewTablePropSet, TablePlugin } from '$lib/types/TablePlugin';
import { getCloned } from '$lib/utils/clone';
import { nonUndefined } from '$lib/utils/filter';
import { derived, writable, type Writable } from 'svelte/store';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGroupedRows = <
	Item,
	Row extends BodyRow<Item>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	GroupOn extends string | number = any
>(
	rows: Row[],
	groupByIds: string[],
	columnOptions: Record<string, GroupByColumnOptions<Item>>
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
		const cells = firstRow.cells.map((cell) => {
			const { id } = cell.column;
			const { cell: label, getAggregateValue } = columnOptions[id] ?? {};
			if (id === groupById) {
				return new DataBodyCell({
					column: cell.column as DataColumn<Item>,
					row: groupRow,
					value: groupOnValue,
					label,
				});
			}
			const columnCells = subRows.map((row) => row.cellForId[id]).filter(nonUndefined);
			const firstColumnCell = columnCells[0];
			if (!(firstColumnCell instanceof DataBodyCell)) {
				return getCloned(firstColumnCell, {
					row: groupRow,
				} as Partial<typeof firstColumnCell>);
			}
			const columnValues = (columnCells as DataBodyCell<Item>[]).map((cell) => cell.value);
			const value = getAggregateValue === undefined ? '' : getAggregateValue(columnValues);
			return new DataBodyCell({
				column: cell.column as DataColumn<Item>,
				row: groupRow,
				value,
				label,
			});
		});
		groupRow.cells = cells;
		groupRow.subRows = subRows.map((row) =>
			getCloned(row, {
				id: `${groupRow.id}>${row.id}`,
				depth: row.depth + 1,
			} as Partial<Row>)
		);
		groupedRows.push(groupRow as Row);
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

		const pluginState: GroupByState = {
			groupByIds,
		};

		const deriveRows: DeriveRowsFn<Item> = (rows) => {
			return derived([rows, groupByIds], ([$rows, $groupByIds]) => {
				const _groupedRows = getGroupedRows($rows, $groupByIds, columnOptions);
				return _groupedRows;
			});
		};

		return {
			pluginState,
			deriveRows,
		};
	};
