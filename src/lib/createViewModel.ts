import type { ReadOrWritable } from 'svelte-subscribe/derivedKeys';
import { derived, readable, writable, type Readable } from 'svelte/store';
import { BodyRow, getBodyRows, getColumnedBodyRows } from './bodyRows';
import { DataColumn, getDataColumns, type Column } from './columns';
import type { Table } from './createTable';
import { getHeaderRows, HeaderRow } from './headerRows';
import type {
	AnyPlugins,
	DeriveFlatColumnsFn,
	DeriveRowsFn,
	PluginStates,
} from './types/TablePlugin';
import { nonUndefined } from './utils/filter';

export interface TableViewModel<Item, Plugins extends AnyPlugins = AnyPlugins> {
	dataColumns: DataColumn<Item, Plugins>[];
	visibleColumns: Readable<DataColumn<Item, Plugins>[]>;
	headerRows: Readable<HeaderRow<Item, Plugins>[]>;
	originalRows: Readable<BodyRow<Item, Plugins>[]>;
	rows: Readable<BodyRow<Item, Plugins>[]>;
	pageRows: Readable<BodyRow<Item, Plugins>[]>;
	pluginStates: PluginStates<Plugins>;
}

export interface TableState<Item, Plugins extends AnyPlugins = AnyPlugins> {
	data: ReadOrWritable<Item[]>;
	columns: Column<Item, Plugins>[];
	dataColumns: DataColumn<Item, Plugins>[];
	visibleColumns: Readable<DataColumn<Item, Plugins>[]>;
	originalRows: Readable<BodyRow<Item>[]>;
	rows: Readable<BodyRow<Item>[]>;
	pageRows: Readable<BodyRow<Item>[]>;
}

export const createViewModel = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	table: Table<Item, Plugins>,
	columns: Column<Item, Plugins>[]
): TableViewModel<Item, Plugins> => {
	const { data, plugins } = table;

	const dataColumns = getDataColumns(columns);
	const flatColumns = readable(dataColumns);

	const originalRows = derived([data, flatColumns], ([$data, $flatColumns]) => {
		return getBodyRows($data, $flatColumns);
	});

	// _stores need to be defined first to pass into plugins for initialization.
	const _visibleColumns = writable<DataColumn<Item, Plugins>[]>([]);
	const _rows = writable<BodyRow<Item>[]>([]);
	const _pageRows = writable<BodyRow<Item>[]>([]);
	const tableState: TableState<Item, Plugins> = {
		data,
		columns,
		dataColumns,
		visibleColumns: _visibleColumns,
		originalRows,
		rows: _rows,
		pageRows: _pageRows,
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

	const deriveFlatColumnsFns: DeriveFlatColumnsFn<Item>[] = Object.values(pluginInstances)
		.map((pluginInstance) => pluginInstance.deriveFlatColumns)
		.filter(nonUndefined);

	let visibleColumns = flatColumns;
	deriveFlatColumnsFns.forEach((fn) => {
		visibleColumns = fn(visibleColumns);
	});

	const injectedColumns = derived(visibleColumns, ($visibleColumns) => {
		_visibleColumns.set($visibleColumns);
		return $visibleColumns;
	});

	const columnedRows = derived(
		[originalRows, injectedColumns],
		([$originalRows, $injectedColumns]) => {
			return getColumnedBodyRows(
				$originalRows,
				$injectedColumns.map((c) => c.id)
			);
		}
	);

	const deriveRowsFns: DeriveRowsFn<Item>[] = Object.values(pluginInstances)
		.map((pluginInstance) => pluginInstance.deriveRows)
		.filter(nonUndefined);

	let rows = columnedRows;
	deriveRowsFns.forEach((fn) => {
		rows = fn(rows);
	});

	const injectedRows = derived(rows, ($rows) => {
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
	});

	const derivePageRowsFns: DeriveRowsFn<Item>[] = Object.values(pluginInstances)
		.map((pluginInstance) => pluginInstance.derivePageRows)
		.filter(nonUndefined);

	// Must derive from `injectedRows` instead of `rows` to ensure that `_rows` is set.
	let pageRows = injectedRows;
	derivePageRowsFns.forEach((fn) => {
		pageRows = fn(pageRows);
	});

	const injectedPageRows = derived(pageRows, ($pageRows) => {
		// Inject state.
		$pageRows.forEach((row) => {
			row.injectState(tableState);
			row.cells.forEach((cell) => {
				cell.injectState(tableState);
			});
		});
		// Apply plugin component hooks.
		Object.entries(pluginInstances).forEach(([pluginName, pluginInstance]) => {
			$pageRows.forEach((row) => {
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
		_pageRows.set($pageRows);
		return $pageRows;
	});

	const headerRows = derived(injectedColumns, ($injectedColumns) => {
		const $headerRows = getHeaderRows(
			columns,
			$injectedColumns.map((c) => c.id)
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
		visibleColumns: injectedColumns,
		headerRows,
		originalRows,
		rows: injectedRows,
		pageRows: injectedPageRows,
		pluginStates,
	};
};
