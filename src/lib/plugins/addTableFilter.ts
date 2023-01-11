import type { BodyRow } from '../bodyRows';
import type { TablePlugin, NewTablePropSet, DeriveRowsFn } from '../types/TablePlugin';
import { recordSetStore } from '../utils/store';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface TableFilterConfig {
	fn?: TableFilterFn;
	initialFilterValue?: string;
	includeHiddenColumns?: boolean;
	serverSide?: boolean;
}

export interface TableFilterState<Item> {
	filterValue: Writable<string>;
	preFilteredRows: Readable<BodyRow<Item>[]>;
}

// Item generic needed to infer type on `getFilteredRows`
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TableFilterColumnOptions<Item> {
	exclude?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getFilterValue?: (value: any) => string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableFilterFn = (props: TableFilterFnProps) => boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableFilterFnProps = {
	filterValue: string;
	value: string;
};

export type TableFilterPropSet = NewTablePropSet<{
	'tbody.tr.td': {
		matches: boolean;
	};
}>;

interface GetFilteredRowsOptions {
	tableCellMatches: Record<string, boolean>;
	fn: TableFilterFn;
	includeHiddenColumns: boolean;
}

const getFilteredRows = <Item, Row extends BodyRow<Item>>(
	rows: Row[],
	filterValue: string,
	columnOptions: Record<string, TableFilterColumnOptions<Item>>,
	{ tableCellMatches, fn, includeHiddenColumns }: GetFilteredRowsOptions
): Row[] => {
	const $filteredRows = rows
		// Filter `subRows`
		.map((row) => {
			const { subRows } = row;
			if (subRows === undefined) {
				return row;
			}
			const filteredSubRows = getFilteredRows(subRows, filterValue, columnOptions, {
				tableCellMatches,
				fn,
				includeHiddenColumns,
			});
			const clonedRow = row.clone() as Row;
			clonedRow.subRows = filteredSubRows;
			return clonedRow;
		})
		.filter((row) => {
			if ((row.subRows?.length ?? 0) !== 0) {
				return true;
			}
			// An array of booleans, true if the cell matches the filter.
			const rowCellMatches = Object.values(row.cellForId).map((cell) => {
				const options = columnOptions[cell.id] as TableFilterColumnOptions<Item> | undefined;
				if (options?.exclude === true) {
					return false;
				}
				const isHidden = row.cells.find((c) => c.id === cell.id) === undefined;
				if (isHidden && !includeHiddenColumns) {
					return false;
				}
				if (!cell.isData()) {
					return false;
				}
				let value = cell.value;
				if (options?.getFilterValue !== undefined) {
					value = options?.getFilterValue(value);
				}
				const matches = fn({ value: String(value), filterValue });
				if (matches) {
					const dataRowColId = cell.dataRowColId();
					if (dataRowColId !== undefined) {
						tableCellMatches[dataRowColId] = matches;
					}
				}
				return matches;
			});
			// If any cell matches, include in the filtered results.
			return rowCellMatches.includes(true);
		});
	return $filteredRows;
};

export const addTableFilter =
	<Item>({
		fn = textPrefixFilter,
		initialFilterValue = '',
		includeHiddenColumns = false,
		serverSide = false,
	}: TableFilterConfig = {}): TablePlugin<
		Item,
		TableFilterState<Item>,
		TableFilterColumnOptions<Item>,
		TableFilterPropSet
	> =>
	({ columnOptions }) => {
		const filterValue = writable(initialFilterValue);
		const preFilteredRows = writable<BodyRow<Item>[]>([]);
		const tableCellMatches = recordSetStore();

		const pluginState: TableFilterState<Item> = { filterValue, preFilteredRows };

		const deriveRows: DeriveRowsFn<Item> = (rows) => {
			return derived([rows, filterValue], ([$rows, $filterValue]) => {
				preFilteredRows.set($rows);
				tableCellMatches.clear();
				const $tableCellMatches: Record<string, boolean> = {};
				const $filteredRows = getFilteredRows($rows, $filterValue, columnOptions, {
					tableCellMatches: $tableCellMatches,
					fn,
					includeHiddenColumns,
				});
				tableCellMatches.set($tableCellMatches);
				if (serverSide) {
					return $rows;
				} else {
					return $filteredRows;
				}
			});
		};

		return {
			pluginState,
			deriveRows,
			hooks: {
				'tbody.tr.td': (cell) => {
					const props = derived(
						[filterValue, tableCellMatches],
						([$filterValue, $tableCellMatches]) => {
							const dataRowColId = cell.dataRowColId();
							return {
								matches:
									$filterValue !== '' &&
									dataRowColId !== undefined &&
									($tableCellMatches[dataRowColId] ?? false),
							};
						}
					);
					return { props };
				},
			},
		};
	};

export const textPrefixFilter: TableFilterFn = ({ filterValue, value }) => {
	if (filterValue === '') {
		return true;
	}
	return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
};
