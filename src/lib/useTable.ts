import { derived, readable, type Readable, type Writable } from 'svelte/store';
import { BodyRow, getBodyRows } from './bodyRows';
import { getDataColumns, type Column } from './columns';
import type { Table } from './createTable';
import { getHeaderRows, HeaderRow } from './headerRows';
import type { AnyPlugins, PluginStates } from './types/UseTablePlugin';

export type UseTableProps<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	columns: Column<Item, Plugins>[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface UseTableState<Item, Plugins extends AnyPlugins = AnyPlugins> {
	data: Writable<Item[]>;
	columns: Column<Item, Plugins>[];
	rows: Readable<BodyRow<Item>[]>;
}

export const useTable = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	table: Table<Item, Plugins>,
	{ columns }: UseTableProps<Item, Plugins>
) => {
	const { data, plugins } = table;

	// const sortFns = Object.values(plugins)
	// 	.map((plugin) => plugin.sortFn)
	// 	.filter(nonNullish);

	// const filterFns = Object.values(plugins)
	// 	.map((plugin) => plugin.filterFn)
	// 	.filter(nonNullish);

	// const visibleColumnIdsFns = Object.values(plugins)
	// 	.map((plugin) => plugin.visibleColumnIdsFn)
	// 	.filter(nonNullish);

	const flatColumns = readable(getDataColumns(columns));
	const visibleColumns = flatColumns;

	// const visibleColumns = derived(
	// 	[flatColumns, ...visibleColumnIdsFns],
	// 	([$flatColumns, ...$visibleColumnIdsFns]) => {
	// 		let ids = $flatColumns.map((c) => c.id);
	// 		$visibleColumnIdsFns.forEach((fn) => {
	// 			ids = fn(ids);
	// 		});
	// 		return ids.map((id) => $flatColumns.find((c) => c.id === id)).filter(nonNullish);
	// 	}
	// );

	const bodyRows = derived([data, visibleColumns], ([$data, $visibleColumns]) => {
		return getBodyRows($data, $visibleColumns);
	});

	// const filteredBodyRows = derived(
	// 	[originalBodyRows, ...filterFns],
	// 	([$bodyRows, ...$filterFns]) => {
	// 		let filteredRows = [...$bodyRows];
	// 		$filterFns.forEach((filterFn) => {
	// 			filteredRows = filteredRows.filter(filterFn);
	// 		});
	// 		return filteredRows;
	// 	}
	// );

	// const sortedBodyRows = derived([filteredBodyRows, ...sortFns], ([$bodyRows, ...$sortFns]) => {
	// 	const sortedRows = [...$bodyRows];
	// 	$sortFns.forEach((sortFn) => {
	// 		sortedRows.sort(sortFn);
	// 	});
	// 	return sortedRows;
	// });

	const tableState: UseTableState<Item, Plugins> = {
		data,
		rows: bodyRows,
		columns,
	};

	const pluginInstances = Object.fromEntries(
		Object.entries(plugins).map(([pluginName, plugin]) => [
			pluginName,
			plugin({ pluginName, tableState }),
		])
	);

	const pluginStates = Object.fromEntries(
		Object.entries(pluginInstances).map(([key, pluginInstance]) => [
			key,
			pluginInstance.pluginState,
		])
	) as PluginStates<Plugins>;

	const headerRows = derived(visibleColumns, ($visibleColumns) => {
		const $headerRows = getHeaderRows(
			columns,
			$visibleColumns.map((c) => c.id)
		);
		// Inject state.
		$headerRows.forEach((row) => {
			row.injectState(tableState);
			row.cells.forEach((cell) => {
				cell.injectState(tableState);
			});
		});
		// Apply plugin component hooks.
		Object.entries(pluginInstances).forEach(([pluginName, pluginInstance]) => {
			$headerRows.forEach((row) => {
				row.cells.forEach((cell) => {
					if (pluginInstance.hooks?.['thead.tr.th'] !== undefined) {
						cell.applyHook(pluginName, pluginInstance.hooks['thead.tr.th'](cell));
					}
				});
			});
		});
		return $headerRows as HeaderRow<Item, Plugins>[];
	});

	return {
		visibleColumns,
		headerRows,
		bodyRows: bodyRows,
		pluginStates,
	};
};
