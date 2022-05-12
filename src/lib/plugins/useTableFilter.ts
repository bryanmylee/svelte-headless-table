import type { BodyRow } from '$lib/bodyRows';
import type { TablePlugin, NewTablePropSet } from '$lib/types/TablePlugin';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface TableFilterConfig {
	fn?: TableFilterFn;
	initialFilterValue?: string;
	includeHiddenColumns?: boolean;
}

export interface TableFilterState<Item> {
	filterValue: Writable<string>;
	preFilteredRows: Readable<BodyRow<Item>[]>;
}

export interface TableFilterColumnOptions {
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

export const useTableFilter =
	<Item>({
		fn = textPrefixFilter,
		initialFilterValue = '',
		includeHiddenColumns = false,
	}: TableFilterConfig = {}): TablePlugin<
		Item,
		TableFilterState<Item>,
		TableFilterColumnOptions,
		TableFilterPropSet
	> =>
	({ columnOptions }) => {
		const filterValue = writable(initialFilterValue);
		const preFilteredRows = writable<BodyRow<Item>[]>([]);
		const filteredRows = writable<BodyRow<Item>[]>([]);
		const tableCellMatches = writable<Record<string, boolean>>({});

		const pluginState: TableFilterState<Item> = { filterValue, preFilteredRows };

		const transformRowsFn = derived(filterValue, ($filterValue) => {
			return (rows: BodyRow<Item>[]) => {
				preFilteredRows.set(rows);
				tableCellMatches.set({});
				const _filteredRows = rows.filter((row) => {
					// An array of booleans, true if the cell matches the filter.
					const rowCellMatches = Object.values(row.cellForId).map((cell) => {
						const options = columnOptions[cell.id] as TableFilterColumnOptions | undefined;
						if (options?.exclude === true) {
							return false;
						}
						const isHidden = row.cells.find((c) => c.id === cell.id) === undefined;
						if (isHidden && !includeHiddenColumns) {
							return false;
						}
						let value = cell.value;
						if (options?.getFilterValue !== undefined) {
							value = options?.getFilterValue(value);
						}
						const matches = fn({ value: String(value), filterValue: $filterValue });
						tableCellMatches.update(($tableCellMatches) => ({
							...$tableCellMatches,
							// TODO standardize table-unique cell id.
							[`${cell.row.id}-${cell.column.id}`]: matches,
						}));
						return matches;
					});
					// If any cell matches, include in the filtered results.
					return rowCellMatches.includes(true);
				});
				filteredRows.set(_filteredRows);
				return _filteredRows;
			};
		});

		return {
			pluginState,
			transformRowsFn,
			hooks: {
				'tbody.tr.td': (cell) => {
					const props = derived(
						[filterValue, tableCellMatches],
						([$filterValue, $tableCellMatches]) => {
							return {
								matches:
									$filterValue !== '' &&
									// TODO standardize table-unique cell id.
									($tableCellMatches[`${cell.row.id}-${cell.column.id}`] ?? false),
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
