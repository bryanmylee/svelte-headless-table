import { derived, readable, type Readable } from 'svelte/store';
import { getBodyRows } from './bodyRows';
import { DataColumn, getFlatColumns, type Column } from './columns';
import { getHeaderRows, HeaderRow } from './headerRows';
import type { ComponentKeys, UseTablePlugin } from './types/plugin';
import { nonNullish } from './utils/filter';

export type UseTableProps<Item> = {
	data: Readable<Array<Item>>;
	columns: Array<Column<Item>>;
};

export const useTable = <Item, Plugins extends Record<string, UseTablePlugin<Item, unknown>>>(
	{ data, columns }: UseTableProps<Item>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	plugins: Plugins = {} as any
) => {
	type PluginStates = { [K in keyof Plugins]: Plugins[K]['pluginState'] };
	type PluginKeyToTablePropSet = {
		[K in keyof Plugins]: Plugins[K] extends UseTablePlugin<Item, unknown, infer E> ? E : never;
	};
	type PluginTablePropSet = {
		[ComponentKey in ComponentKeys]: {
			[PluginKey in keyof Plugins]: PluginKeyToTablePropSet[PluginKey][ComponentKey];
		};
	};

	const pluginStates = Object.fromEntries(
		Object.entries(plugins).map(([key, plugin]) => [key, plugin.pluginState])
	) as PluginStates;

	const sortFns = Object.values(plugins)
		.map((plugin) => plugin.sortFn)
		.filter(nonNullish);

	const flatColumnIdFns = Object.values(plugins)
		.map((plugin) => plugin.flatColumnIdFn)
		.filter(nonNullish);

	const flatColumns = readable(getFlatColumns(columns));
	const orderedFlatColumns = derived(
		[flatColumns, ...flatColumnIdFns],
		([$flatColumns, ...$flatColumnIdFns]) => {
			let ids = $flatColumns.map((c) => c.id);
			$flatColumnIdFns.forEach((fn) => {
				ids = fn(ids);
			});
			return ids.map((id) => $flatColumns.find((c) => c.id === id)).filter(nonNullish);
		}
	);

	const headerRows = derived(orderedFlatColumns, ($orderedFlatColumns) => {
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
		return $headerRows as Array<HeaderRow<Item, PluginTablePropSet>>;
	});

	const originalBodyRows = derived([data, orderedFlatColumns], ([$data, $orderedFlatColumns]) => {
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
		flatColumns,
		headerRows,
		bodyRows,
		pluginStates,
	};
};
