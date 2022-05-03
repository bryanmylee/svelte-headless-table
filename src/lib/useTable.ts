import { derived, readable } from 'svelte/store';
import { getBodyRows } from './bodyRows';
import { getFlatColumns, type Column } from './columns';
import type { Table } from './createTable';
import { getHeaderRows, HeaderRow } from './headerRows';
import type { AnyPlugins, PluginStates } from './types/UseTablePlugin';
import { nonNullish } from './utils/filter';

export type UseTableProps<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	columns: Column<Item, Plugins>[];
};

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

	const visibleColumnIdsFns = Object.values(plugins)
		.map((plugin) => plugin.visibleColumnIdsFn)
		.filter(nonNullish);

	const flatColumns = readable(getFlatColumns(columns));
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

	const headerRows = derived(visibleColumns, ($orderedFlatColumns) => {
		const $headerRows = getHeaderRows(
			columns,
			$orderedFlatColumns.map((c) => c.id)
		);
		// Apply hooks.
		Object.entries(plugins).forEach(([pluginName, plugin]) => {
			$headerRows.forEach((row) => {
				row.cells.forEach((cell) => {
					if (plugin.hooks?.['thead.tr.th'] !== undefined) {
						cell.applyHook(pluginName, plugin.hooks['thead.tr.th'](cell));
					}
				});
			});
		});
		// Inject inferred TablePropSet type.
		return $headerRows as HeaderRow<Item, Plugins>[];
	});

	const originalBodyRows = derived([data, visibleColumns], ([$data, $orderedFlatColumns]) => {
		return getBodyRows($data, $orderedFlatColumns);
	});
	const bodyRows = derived([originalBodyRows, ...sortFns], ([$originalBodyRows, ...$sortFns]) => {
		const sortedRows = [...$originalBodyRows];
		$sortFns.forEach((sortFn) => {
			sortedRows.sort(sortFn);
		});
		return sortedRows;
	});

	return {
		visibleColumns,
		headerRows,
		bodyRows,
		pluginStates,
	};
};
