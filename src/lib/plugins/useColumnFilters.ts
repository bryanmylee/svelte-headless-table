import { keyed } from 'svelte-keyed';
import type { BodyRow } from '$lib/bodyRows';
import type { TablePlugin, NewTablePropSet, DeriveRowsFn } from '$lib/types/TablePlugin';
import { derived, writable, type Readable, type Writable } from 'svelte/store';
import type { RenderConfig } from '$lib/render';
import type { PluginInitTableState } from '$lib/createViewModel';

export interface ColumnFiltersState<Item> {
	filterValues: Writable<Record<string, unknown>>;
	preFilteredRows: Readable<BodyRow<Item>[]>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ColumnFiltersColumnOptions<Item, FilterValue = any> {
	fn: ColumnFilterFn<FilterValue>;
	initialFilterValue?: FilterValue;
	render: (props: ColumnRenderConfigPropArgs<Item, FilterValue>) => RenderConfig;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ColumnRenderConfigPropArgs<Item, FilterValue = any, Value = any>
	extends PluginInitTableState<Item> {
	id: string;
	filterValue: Writable<FilterValue>;
	values: Readable<Value[]>;
	preFilteredRows: Readable<BodyRow<Item>[]>;
	preFilteredValues: Readable<Value[]>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ColumnFilterFn<FilterValue = any, Value = any> = (
	props: ColumnFilterFnProps<FilterValue, Value>
) => boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ColumnFilterFnProps<FilterValue = any, Value = any> = {
	filterValue: FilterValue;
	value: Value;
};

export type ColumnFiltersPropSet = NewTablePropSet<{
	'thead.tr.th':
		| {
				render: RenderConfig;
		  }
		| undefined;
}>;

export const useColumnFilters =
	<Item>(): TablePlugin<
		Item,
		ColumnFiltersState<Item>,
		ColumnFiltersColumnOptions<Item>,
		ColumnFiltersPropSet
	> =>
	({ columnOptions, tableState }) => {
		const filterValues = writable<Record<string, unknown>>({});
		const preFilteredRows = writable<BodyRow<Item>[]>([]);
		const filteredRows = writable<BodyRow<Item>[]>([]);

		const pluginState: ColumnFiltersState<Item> = { filterValues, preFilteredRows };

		const deriveRows: DeriveRowsFn<Item> = (rows) => {
			return derived([rows, filterValues], ([$rows, $filterValues]) => {
				preFilteredRows.set($rows);
				const _filteredRows = $rows.filter((row) => {
					for (const [columnId, columnOption] of Object.entries(columnOptions)) {
						const { value } = row.cellForId[columnId];
						const filterValue = $filterValues[columnId];
						if (filterValue === undefined) {
							continue;
						}
						const isMatch = columnOption.fn({ value, filterValue });
						if (!isMatch) {
							return false;
						}
					}
					return true;
				});
				filteredRows.set(_filteredRows);
				return _filteredRows;
			});
		};

		return {
			pluginState,
			deriveRows,
			hooks: {
				'thead.tr.th': (cell) => {
					const filterValue = keyed(filterValues, cell.id);
					const props = derived([], () => {
						const columnOption = columnOptions[cell.id];
						if (columnOption === undefined) {
							return undefined;
						}
						filterValue.set(columnOption.initialFilterValue);
						const preFilteredValues = derived(preFilteredRows, ($rows) =>
							$rows.map((row) => row.cellForId[cell.id].value)
						);
						const values = derived(filteredRows, ($rows) =>
							$rows.map((row) => row.cellForId[cell.id].value)
						);
						const render = columnOption.render({
							id: cell.id,
							filterValue,
							...tableState,
							values,
							preFilteredRows,
							preFilteredValues,
						});
						return { render };
					});
					return { props };
				},
			},
		};
	};

export const matchFilter: ColumnFilterFn<unknown, unknown> = ({ filterValue, value }) => {
	if (filterValue === undefined) {
		return true;
	}
	return filterValue === value;
};

export const textPrefixFilter: ColumnFilterFn<string, string> = ({ filterValue, value }) => {
	if (filterValue === '') {
		return true;
	}
	return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
};

export const numberRangeFilter: ColumnFilterFn<[number | null, number | null], number> = ({
	filterValue: [min, max],
	value,
}) => {
	return (min ?? -Infinity) <= value && value <= (max ?? Infinity);
};
