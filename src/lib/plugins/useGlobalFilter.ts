import type { BodyRow } from '$lib/bodyRows';
import type { UseTablePlugin, NewTablePropSet } from '$lib/types/UseTablePlugin';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface GlobalFilterConfig {
	fn?: GlobalFilterFn;
	initialFilterValue?: string | number;
	includeHiddenColumns?: boolean;
}

export interface GlobalFilterState<Item> {
	filterValue: Writable<string | number>;
	preFilteredRows: Readable<BodyRow<Item>[]>;
}

export interface GlobalFilterColumnOptions {
	exclude?: boolean;
	getFilterValue?: (value: unknown) => string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GlobalFilterFn<FilterValue = any, Value = any> = (
	props: GlobalFilterFnProps<FilterValue, Value>
) => boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GlobalFilterFnProps<FilterValue = any, Value = any> = {
	filterValue: FilterValue;
	value: Value;
};

export type GlobalFilterPropSet = NewTablePropSet<{
	'tbody.tr.td': {
		matches: boolean;
	};
}>;

export const useGlobalFilter =
	<Item>({
		fn = textPrefixFilter,
		initialFilterValue = '',
		includeHiddenColumns = false,
	}: GlobalFilterConfig = {}): UseTablePlugin<
		Item,
		{
			PluginState: GlobalFilterState<Item>;
			ColumnOptions: GlobalFilterColumnOptions;
			TablePropSet: GlobalFilterPropSet;
		}
	> =>
	({ columnOptions }) => {
		const filterValue = writable(initialFilterValue);
		const preFilteredRows = writable<BodyRow<Item>[]>([]);
		const filteredRows = writable<BodyRow<Item>[]>([]);

		const pluginState: GlobalFilterState<Item> = { filterValue, preFilteredRows };

		const transformRowsFn = derived(filterValue, ($filterValue) => {
			return (rows: BodyRow<Item>[]) => {
				preFilteredRows.set(rows);
				const _filteredRows = rows.filter((row) => {
					// An array of booleans, true if the cell matches the filter.
					const cellMatches = Object.values(row.cellForId).map((cell) => {
						if (columnOptions[cell.id]?.exclude) {
							return false;
						}
						const isHidden = row.cells.find((c) => c.id === cell.id) === undefined;
						if (isHidden && !includeHiddenColumns) {
							return false;
						}
						let value = cell.value;
						if (columnOptions[cell.id]?.getFilterValue !== undefined) {
							value = columnOptions[cell.id]?.getFilterValue(value);
						}
						return fn({ value, filterValue: $filterValue });
					});
					// If any cell matches, include in the filtered results.
					return cellMatches.includes(true);
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
					const props = derived([], () => {
						return {
							matches: false,
						};
					});
					return { props };
				},
			},
		};
	};

export const textPrefixFilter: GlobalFilterFn<string, string> = ({ filterValue, value }) => {
	if (filterValue === '') {
		return true;
	}
	return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
};
