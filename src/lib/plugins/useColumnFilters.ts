import { get } from 'svelte/store';
import type { BodyRow } from '$lib/bodyRows';
import { getDataColumns } from '$lib/columns';
import type { UseTablePlugin, NewTablePropSet } from '$lib/types/UseTablePlugin';
import { derived, writable, type Writable } from 'svelte/store';

export interface ColumnFiltersState {
	filterValues: Writable<Record<string, unknown>>;
}

export interface ColumnFiltersColumnOptions {
	fn: ColumnFilterFn;
}

export type ColumnFilterFn = (props: ColumnFilterFnProps) => boolean;

export type ColumnFilterFnProps = {
	filterValue: unknown;
	value: unknown;
};

export type ColumnFiltersPropSet = NewTablePropSet<{
	'thead.tr.th': {
		setValue: (value: unknown) => void;
	};
}>;

export const useColumnFilters = <Item>(): UseTablePlugin<
	Item,
	{
		PluginState: ColumnFiltersState;
		ColumnOptions: ColumnFiltersColumnOptions;
		TablePropSet: ColumnFiltersPropSet;
	}
> => {
	const filterValues = writable<Record<string, unknown>>({});

	const pluginState: ColumnFiltersState = { filterValues };

	const pluginName = writable<string>();
	const columnOptions = writable<Record<string, ColumnFiltersColumnOptions>>({});

	const filterFn = derived(
		[filterValues, pluginName, columnOptions],
		([$filterValues, $pluginName, $columnOptions]) => {
			console.log({ $filterValues, $pluginName, $columnOptions });
			return (row: BodyRow<Item>) => {
				for (const [columnId, columnOption] of Object.entries($columnOptions)) {
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
			};
		}
	);

	return {
		pluginState,
		filterFn,
		onPluginInit: ({ name }) => {
			pluginName.set(name);
		},
		onCreateColumns: (columns) => {
			const dataColumns = getDataColumns(columns);
			const $pluginName = get(pluginName);
			dataColumns.forEach((c) => {
				const columnOption: ColumnFiltersColumnOptions | undefined = c.plugins?.[$pluginName];
				if (columnOption === undefined) return;
				columnOptions.update(($columnOptions) => ({
					...$columnOptions,
					[c.id]: columnOption,
				}));
			});
		},
		hooks: {
			'thead.tr.th': (cell) => {
				const props = derived(filterValues, ($filterValues) => {
					const setValue = (value: unknown) => {
						filterValues.update((_filterValues) => ({
							..._filterValues,
							[cell.id]: value,
						}));
					};
					return { setValue };
				});
				return { props };
			},
		},
	};
};
