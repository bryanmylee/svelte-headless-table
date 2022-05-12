import type { ReadOrWritable } from 'svelte-subscribe/derivedKeys';
import { derived, readable, writable, type Readable } from 'svelte/store';
import { BodyRow, getBodyRows, getColumnedBodyRows } from './bodyRows';
import { DataColumn, getDataColumns, type Column } from './columns';
import type { Table } from './createTable';
import { getHeaderRows, HeaderRow } from './headerRows';
import type {
	AnyPlugins,
	PluginStates,
	TransformFlatColumnsFn,
	TransformRowsFn,
} from './types/TablePlugin';
import { nonUndefined } from './utils/filter';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TableState<Item, Plugins extends AnyPlugins = AnyPlugins> {
	data: ReadOrWritable<Item[]>;
	columns: Column<Item, Plugins>[];
	dataColumns: DataColumn<Item, Plugins>[];
	visibleColumns: Readable<DataColumn<Item, Plugins>[]>;
	originalRows: Readable<BodyRow<Item>[]>;
	rows: Readable<BodyRow<Item>[]>;
}

export const useTable = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	table: Table<Item, Plugins>,
	columns: Column<Item, Plugins>[]
) => {
	const { data, plugins } = table;

	const dataColumns = getDataColumns(columns);
	const flatColumns = readable(dataColumns);

	const originalRows = derived([data, flatColumns], ([$data, $flatColumns]) => {
		return getBodyRows($data, $flatColumns);
	});

	// _stores need to be defined first to pass into plugins for initialization.
	const _visibleColumns = writable<DataColumn<Item, Plugins>[]>([]);
	const _rows = writable<BodyRow<Item>[]>([]);
	const tableState: TableState<Item, Plugins> = {
		data,
		columns,
		dataColumns,
		visibleColumns: _visibleColumns,
		originalRows,
		rows: _rows,
	};

	const pluginInstances = Object.fromEntries(
		Object.entries(plugins).map(([pluginName, plugin]) => {
			const columnOptions = Object.fromEntries(
				dataColumns
					.map((c) => {
						const option = c.plugins?.[pluginName];
						if (option === undefined) return undefined;
						return [c.id, option] as const;
					})
					.filter(nonUndefined)
			);
			return [pluginName, plugin({ pluginName, tableState, columnOptions })];
		})
	) as {
		[K in keyof Plugins]: ReturnType<Plugins[K]>;
	};

	const pluginStates = Object.fromEntries(
		Object.entries(pluginInstances).map(([key, pluginInstance]) => [
			key,
			pluginInstance.pluginState,
		])
	) as PluginStates<Plugins>;

	const transformFlatColumnsFns: Readable<TransformFlatColumnsFn<Item>>[] = Object.values(
		pluginInstances
	)
		.map((pluginInstance) => pluginInstance.transformFlatColumnsFn)
		.filter(nonUndefined);

	const visibleColumns = derived(
		[flatColumns, ...transformFlatColumnsFns],
		([$flatColumns, ...$transformFlatColumnsFns]) => {
			let columns: DataColumn<Item, Plugins>[] = [...$flatColumns];
			$transformFlatColumnsFns.forEach((fn) => {
				columns = fn(columns) as DataColumn<Item, Plugins>[];
			});
			_visibleColumns.set(columns);
			return columns;
		}
	);

	const columnedRows = derived(
		[originalRows, visibleColumns],
		([$originalRows, $visibleColumns]) => {
			return getColumnedBodyRows(
				$originalRows,
				$visibleColumns.map((c) => c.id)
			);
		}
	);

	const transformRowsFns: Readable<TransformRowsFn<Item>>[] = Object.values(pluginInstances)
		.map((pluginInstance) => pluginInstance.transformRowsFn)
		.filter(nonUndefined);

	const rows = derived(
		[columnedRows, ...transformRowsFns],
		([$columnedRows, ...$transformFowsFns]) => {
			let $rows: BodyRow<Item, Plugins>[] = [...$columnedRows];
			$transformFowsFns.forEach((fn) => {
				$rows = fn($rows) as BodyRow<Item, Plugins>[];
			});
			// Inject state.
			$rows.forEach((row) => {
				row.injectState(tableState);
				row.cells.forEach((cell) => {
					cell.injectState(tableState);
				});
			});
			// Apply plugin component hooks.
			Object.entries(pluginInstances).forEach(([pluginName, pluginInstance]) => {
				$rows.forEach((row) => {
					if (pluginInstance.hooks?.['tbody.tr'] !== undefined) {
						row.applyHook(pluginName, pluginInstance.hooks['tbody.tr'](row));
					}
					row.cells.forEach((cell) => {
						if (pluginInstance.hooks?.['tbody.tr.td'] !== undefined) {
							cell.applyHook(pluginName, pluginInstance.hooks['tbody.tr.td'](cell));
						}
					});
				});
			});
			_rows.set($rows);
			return $rows;
		}
	);

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
				if (pluginInstance.hooks?.['thead.tr'] !== undefined) {
					row.applyHook(pluginName, pluginInstance.hooks['thead.tr'](row));
				}
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
		dataColumns,
		visibleColumns,
		headerRows,
		originalRows,
		rows,
		pluginStates,
	};
};
