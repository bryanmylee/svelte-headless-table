import { derived, readable, writable, type Readable, type Writable } from 'svelte/store';
import { BodyRow, getBodyRows, getColumnedBodyRows } from './bodyRows';
import { getDataColumns, type Column } from './columns';
import type { Table } from './createTable';
import { getHeaderRows, HeaderRow } from './headerRows';
import type { AnyPlugins, PluginStates, TransformRowsFn } from './types/UseTablePlugin';
import { nonNullish } from './utils/filter';

export type UseTableProps<Item, Plugins extends AnyPlugins = AnyPlugins> = {
	columns: Column<Item, Plugins>[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface UseTableState<Item, Plugins extends AnyPlugins = AnyPlugins> {
	data: Writable<Item[]>;
	columns: Column<Item, Plugins>[];
	originalRows: Readable<BodyRow<Item>[]>;
	rows: Readable<BodyRow<Item>[]>;
}

export const useTable = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	table: Table<Item, Plugins>,
	{ columns }: UseTableProps<Item, Plugins>
) => {
	const { data, plugins } = table;

	const flatColumns = readable(getDataColumns(columns));

	const originalRows = derived([data, flatColumns], ([$data, $flatColumns]) => {
		return getBodyRows($data, $flatColumns);
	});

	// _stores need to be defined first to pass into plugins for initialization.
	const _rows = writable<BodyRow<Item>[]>([]);
	const tableState: UseTableState<Item, Plugins> = {
		data,
		originalRows,
		columns,
		rows: _rows,
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

	const visibleColumnIdsFns = Object.values(pluginInstances)
		.map((pluginInstances) => pluginInstances.visibleColumnIdsFn)
		.filter(nonNullish);

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

	const transformRowsFns: Readable<TransformRowsFn<Item>>[] = Object.values(pluginInstances)
		.map((pluginInstance) => pluginInstance.transformRowsFn)
		.filter(nonNullish);

	const transformedRows = derived(
		[originalRows, ...transformRowsFns],
		([$originalRows, ...$transformFowsFns]) => {
			let transformedRows: BodyRow<Item, Plugins>[] = [...$originalRows];
			$transformFowsFns.forEach((fn) => {
				transformedRows = fn(transformedRows) as BodyRow<Item, Plugins>[];
			});
			return transformedRows;
		}
	);

	const rows = derived([transformedRows, visibleColumns], ([$transformedRows, $visibleColumns]) => {
		const columnedBodyRows = getColumnedBodyRows(
			$transformedRows,
			$visibleColumns.map((c) => c.id)
		);
		_rows.set(columnedBodyRows);
		return columnedBodyRows;
	});

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
		originalRows,
		rows,
		pluginStates,
	};
};
