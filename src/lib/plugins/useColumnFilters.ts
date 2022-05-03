import { get } from 'svelte/store';
import { keyed } from 'svelte-keyed';
import type { BodyRow } from '$lib/bodyRows';
import { getDataColumns } from '$lib/columns';
import type { UseTablePlugin, NewTablePropSet } from '$lib/types/UseTablePlugin';
import { derived, writable, type Writable } from 'svelte/store';
import type { RenderConfig } from '$lib/render';

export interface ColumnFiltersState {
	filterValues: Writable<Record<string, unknown>>;
}

export interface ColumnFiltersColumnOptions {
	fn: ColumnFilterFn;
	render: (props: ColumnRenderConfigProps) => RenderConfig<ColumnRenderConfigProps>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ColumnRenderConfigProps<T = any> {
	filterValue: Writable<T>;
}

export type ColumnFilterFn = (props: ColumnFilterFnProps) => boolean;

export type ColumnFilterFnProps = {
	filterValue: unknown;
	value: unknown;
};

export type ColumnFiltersPropSet = NewTablePropSet<{
	'thead.tr.th':
		| {
				render: RenderConfig;
				value: unknown;
				setValue: (value: unknown) => void;
		  }
		| undefined;
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
	const filtersColumnOptions = writable<Record<string, ColumnFiltersColumnOptions>>({});

	const filterFn = derived(
		[filterValues, filtersColumnOptions],
		([$filterValues, $filtersColumnOptions]) => {
			return (row: BodyRow<Item>) => {
				for (const [columnId, columnOption] of Object.entries($filtersColumnOptions)) {
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
				filtersColumnOptions.update(($columnOptions) => ({
					...$columnOptions,
					[c.id]: columnOption,
				}));
			});
		},
		hooks: {
			'thead.tr.th': (cell) => {
				const setValue = (value: unknown) => {
					filterValues.update((_filterValues) => ({
						..._filterValues,
						[cell.id]: value,
					}));
				};
				const filterValue = keyed(filterValues, cell.id);
				const props = derived(
					[filterValues, filtersColumnOptions],
					([$filterValues, $filtersColumnOptions]) => {
						const columnOption = $filtersColumnOptions[cell.id];
						if (columnOption === undefined) {
							return undefined;
						}
						const value = $filterValues[cell.id];
						const render = columnOption.render({ filterValue });
						return { value, setValue, render };
					}
				);
				return { props };
			},
		},
	};
};

export const textPrefixMatch: ColumnFilterFn = ({ value, filterValue }) => {
	if (filterValue === '') {
		return true;
	}
	return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
};
