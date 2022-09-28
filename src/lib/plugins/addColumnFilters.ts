import { keyed } from 'svelte-keyed';
import type { RenderConfig } from 'svelte-render';
import type { BodyRow } from '$lib/bodyRows';
import type { TablePlugin, NewTablePropSet, DeriveRowsFn } from '$lib/types/TablePlugin';
import { derived, writable, type Readable, type Writable } from 'svelte/store';
import type { PluginInitTableState } from '$lib/createViewModel';
import type { DataBodyCell } from '$lib/bodyCells';

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

const getFilteredRows = <Item, Row extends BodyRow<Item>>(
	rows: Row[],
	filterValues: Record<string, unknown>,
	columnOptions: Record<string, ColumnFiltersColumnOptions<Item>>
): Row[] => {
	const $filteredRows = rows
		// Filter `subRows`
		.map((row) => {
			const { subRows } = row;
			if (subRows === undefined) {
				return row;
			}
			const filteredSubRows = getFilteredRows(subRows, filterValues, columnOptions);
			const clonedRow = row.clone() as Row;
			clonedRow.subRows = filteredSubRows;
			return clonedRow;
		})
		.filter((row) => {
			if ((row.subRows?.length ?? 0) !== 0) {
				return true;
			}
			for (const [columnId, columnOption] of Object.entries(columnOptions)) {
				const bodyCell = row.cellForId[columnId];
				if (!bodyCell.isData()) {
					continue;
				}
				const { value } = bodyCell;
				const filterValue = filterValues[columnId];
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
	return $filteredRows;
};

export const addColumnFilters =
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
				const _filteredRows = getFilteredRows($rows, $filterValues, columnOptions);
				filteredRows.set(_filteredRows);
				return _filteredRows;
			});
		};

		return {
			pluginState,
			deriveRows,
			hooks: {
				'thead.tr.th': (headerCell) => {
					const filterValue = keyed(filterValues, headerCell.id);
					const props = derived([], () => {
						const columnOption = columnOptions[headerCell.id];
						if (columnOption === undefined) {
							return undefined;
						}
						filterValue.set(columnOption.initialFilterValue);
						const preFilteredValues = derived(preFilteredRows, ($rows) => {
							if (headerCell.isData()) {
								return $rows.map((row) => {
									// TODO check and handle different BodyCell types
									const cell = row.cellForId[headerCell.id] as DataBodyCell<Item>;
									return cell?.value;
								});
							}
							return [];
						});
						const values = derived(filteredRows, ($rows) => {
							if (headerCell.isData()) {
								return $rows.map((row) => {
									// TODO check and handle different BodyCell types
									const cell = row.cellForId[headerCell.id] as DataBodyCell<Item>;
									return cell?.value;
								});
							}
							return [];
						});
						const render = columnOption.render({
							id: headerCell.id,
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
