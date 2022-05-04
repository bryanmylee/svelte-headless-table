import { derived, readable, type Writable } from 'svelte/store';
import { getBodyRows } from './bodyRows';
import { getDataColumns, type Column } from './columns';
import type { Table } from './createTable';
import { getHeaderRows, HeaderRow } from './headerRows';
import type { AnyPlugins, PluginStates } from './types/UseTablePlugin';
import { nonNullish } from './utils/filter';

export type UseTableProps<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	columns: Column<Item, Plugins>[];
};

export interface UseTableState<Item, Plugins extends AnyPlugins = AnyPlugins> {
	data: Writable<Item[]>;
}

export const useTable = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	table: Table<Item, Plugins>,
	{ columns }: UseTableProps<Item, Plugins>
) => {
	const { data, plugins } = table;

	const pluginStates = Object.fromEntries(
		Object.entries(plugins).map(([key, plugin]) => [key, plugin.pluginState])
	) as PluginStates<Plugins>;

	const sortFns = Object.values(plugins)
		.map((plugin) => plugin.sortFn)
		.filter(nonNullish);

	const filterFns = Object.values(plugins)
		.map((plugin) => plugin.filterFn)
		.filter(nonNullish);

	const visibleColumnIdsFns = Object.values(plugins)
		.map((plugin) => plugin.visibleColumnIdsFn)
		.filter(nonNullish);

	const flatColumns = readable(getDataColumns(columns));
	const visibleColumns = derived(
		[flatColumns, ...visibleColumnIdsFns],
		([$flatColumns, ...$visibleColumnIdsFns]) => {
			let ids = $flatColumns.map((c) => c.id);
			$visibleColumnIdsFns.forEach((fn) => {
				ids = fn(ids);
			});
			return ids.map((id) => $flatColumns.find((c) => c.id === id)).filter(nonNullish);
		}
	);

	const state: UseTableState<Item, Plugins> = {
		data,
	};

	const headerRows = derived(visibleColumns, ($orderedFlatColumns) => {
		const $headerRows = getHeaderRows(
			columns,
			$orderedFlatColumns.map((c) => c.id)
		);
		// Inject state.
		$headerRows.forEach((row) => {
			row.injectState(state);
			row.cells.forEach((cell) => {
				cell.injectState(state);
			});
		});
		// Apply plugin component hooks.
		Object.entries(plugins).forEach(([pluginName, plugin]) => {
			$headerRows.forEach((row) => {
				row.cells.forEach((cell) => {
					if (plugin.hooks?.['thead.tr.th'] !== undefined) {
						cell.applyHook(pluginName, plugin.hooks['thead.tr.th'](cell));
					}
				});
			});
		});
		return $headerRows as HeaderRow<Item, Plugins>[];
	});

	const originalBodyRows = derived([data, visibleColumns], ([$data, $orderedFlatColumns]) => {
		return getBodyRows($data, $orderedFlatColumns);
	});
	const filteredBodyRows = derived(
		[originalBodyRows, ...filterFns],
		([$bodyRows, ...$filterFns]) => {
			let filteredRows = [...$bodyRows];
			$filterFns.forEach((filterFn) => {
				filteredRows = filteredRows.filter(filterFn);
			});
			return filteredRows;
		}
	);
	const sortedBodyRows = derived([filteredBodyRows, ...sortFns], ([$bodyRows, ...$sortFns]) => {
		const sortedRows = [...$bodyRows];
		$sortFns.forEach((sortFn) => {
			sortedRows.sort(sortFn);
		});
		return sortedRows;
	});

	return {
		visibleColumns,
		headerRows,
		bodyRows: sortedBodyRows,
		pluginStates,
	};
};
