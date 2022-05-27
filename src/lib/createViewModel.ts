import type { ReadOrWritable } from 'svelte-subscribe/derivedKeys';
import { derived, readable, writable, type Readable } from 'svelte/store';
import { BodyRow, getBodyRows, getColumnedBodyRows } from './bodyRows';
import { FlatColumn, getFlatColumns, type Column } from './columns';
import type { Table } from './createTable';
import { getHeaderRows, HeaderRow } from './headerRows';
import type {
	AnyPlugins,
	DeriveFlatColumnsFn,
	DeriveRowsFn,
	DeriveFn,
	PluginStates,
} from './types/TablePlugin';
import { finalizeAttributes } from './utils/attributes';
import { nonUndefined } from './utils/filter';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type TableAttributes<Item, Plugins extends AnyPlugins = AnyPlugins> = Record<
	string,
	unknown
> & {
	role: 'table';
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type TableHeadAttributes<Item, Plugins extends AnyPlugins = AnyPlugins> = Record<
	string,
	unknown
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type TableBodyAttributes<Item, Plugins extends AnyPlugins = AnyPlugins> = Record<
	string,
	unknown
> & {
	role: 'rowgroup';
};

export interface TableViewModel<Item, Plugins extends AnyPlugins = AnyPlugins> {
	flatColumns: FlatColumn<Item, Plugins>[];
	tableAttrs: Readable<TableAttributes<Item, Plugins>>;
	tableHeadAttrs: Readable<TableHeadAttributes<Item, Plugins>>;
	tableBodyAttrs: Readable<TableBodyAttributes<Item, Plugins>>;
	visibleColumns: Readable<FlatColumn<Item, Plugins>[]>;
	headerRows: Readable<HeaderRow<Item, Plugins>[]>;
	originalRows: Readable<BodyRow<Item, Plugins>[]>;
	rows: Readable<BodyRow<Item, Plugins>[]>;
	pageRows: Readable<BodyRow<Item, Plugins>[]>;
	pluginStates: PluginStates<Plugins>;
}

export interface PluginInitTableState<Item, Plugins extends AnyPlugins = AnyPlugins>
	extends Omit<TableViewModel<Item, Plugins>, 'pluginStates'> {
	data: ReadOrWritable<Item[]>;
	columns: Column<Item, Plugins>[];
}

export interface TableState<Item, Plugins extends AnyPlugins = AnyPlugins>
	extends TableViewModel<Item, Plugins> {
	data: ReadOrWritable<Item[]>;
	columns: Column<Item, Plugins>[];
}

export const createViewModel = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	table: Table<Item, Plugins>,
	columns: Column<Item, Plugins>[]
): TableViewModel<Item, Plugins> => {
	const { data, plugins } = table;

	const $flatColumns = getFlatColumns(columns);
	const flatColumns = readable($flatColumns);

	const originalRows = derived([data, flatColumns], ([$data, $flatColumns]) => {
		return getBodyRows($data, $flatColumns);
	});

	// _stores need to be defined first to pass into plugins for initialization.
	const _visibleColumns = writable<FlatColumn<Item, Plugins>[]>([]);
	const _headerRows = writable<HeaderRow<Item, Plugins>[]>();
	const _rows = writable<BodyRow<Item, Plugins>[]>([]);
	const _pageRows = writable<BodyRow<Item, Plugins>[]>([]);
	const _tableAttrs = writable<TableAttributes<Item>>({
		role: 'table' as const,
	});
	const _tableHeadAttrs = writable<TableHeadAttributes<Item>>({});
	const _tableBodyAttrs = writable<TableBodyAttributes<Item>>({
		role: 'rowgroup' as const,
	});
	const pluginInitTableState: PluginInitTableState<Item, Plugins> = {
		data,
		columns,
		flatColumns: $flatColumns,
		tableAttrs: _tableAttrs,
		tableHeadAttrs: _tableHeadAttrs,
		tableBodyAttrs: _tableBodyAttrs,
		visibleColumns: _visibleColumns,
		headerRows: _headerRows,
		originalRows,
		rows: _rows,
		pageRows: _pageRows,
	};

	const pluginInstances = Object.fromEntries(
		Object.entries(plugins).map(([pluginName, plugin]) => {
			const columnOptions = Object.fromEntries(
				$flatColumns
					.map((c) => {
						const option = c.plugins?.[pluginName];
						if (option === undefined) return undefined;
						return [c.id, option] as const;
					})
					.filter(nonUndefined)
			);
			return [pluginName, plugin({ pluginName, tableState: pluginInitTableState, columnOptions })];
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

	const tableState: TableState<Item, Plugins> = {
		data,
		columns,
		flatColumns: $flatColumns,
		tableAttrs: _tableAttrs,
		tableHeadAttrs: _tableHeadAttrs,
		tableBodyAttrs: _tableBodyAttrs,
		visibleColumns: _visibleColumns,
		headerRows: _headerRows,
		originalRows,
		rows: _rows,
		pageRows: _pageRows,
		pluginStates,
	};

	const deriveTableAttrsFns: DeriveFn<TableAttributes<Item>>[] = Object.values(pluginInstances)
		.map((pluginInstance) => pluginInstance.deriveTableAttrs)
		.filter(nonUndefined);
	let tableAttrs = readable<TableAttributes<Item>>({
		role: 'table',
	});
	deriveTableAttrsFns.forEach((fn) => {
		tableAttrs = fn(tableAttrs);
	});
	const finalizedTableAttrs = derived(tableAttrs, ($tableAttrs) => {
		const $finalizedAttrs = finalizeAttributes($tableAttrs) as TableAttributes<Item>;
		_tableAttrs.set($finalizedAttrs);
		return $finalizedAttrs;
	});

	const deriveTableHeadAttrsFns: DeriveFn<TableHeadAttributes<Item>>[] = Object.values(
		pluginInstances
	)
		.map((pluginInstance) => pluginInstance.deriveTableBodyAttrs)
		.filter(nonUndefined);
	let tableHeadAttrs = readable<TableHeadAttributes<Item>>({});
	deriveTableHeadAttrsFns.forEach((fn) => {
		tableHeadAttrs = fn(tableHeadAttrs);
	});
	const finalizedTableHeadAttrs = derived(tableHeadAttrs, ($tableHeadAttrs) => {
		const $finalizedAttrs = finalizeAttributes($tableHeadAttrs) as TableHeadAttributes<Item>;
		_tableHeadAttrs.set($finalizedAttrs);
		return $finalizedAttrs;
	});

	const deriveTableBodyAttrsFns: DeriveFn<TableBodyAttributes<Item>>[] = Object.values(
		pluginInstances
	)
		.map((pluginInstance) => pluginInstance.deriveTableBodyAttrs)
		.filter(nonUndefined);
	let tableBodyAttrs = readable<TableBodyAttributes<Item>>({
		role: 'rowgroup',
	});
	deriveTableBodyAttrsFns.forEach((fn) => {
		tableBodyAttrs = fn(tableBodyAttrs);
	});
	const finalizedTableBodyAttrs = derived(tableBodyAttrs, ($tableBodyAttrs) => {
		const $finalizedAttrs = finalizeAttributes($tableBodyAttrs) as TableBodyAttributes<Item>;
		_tableBodyAttrs.set($finalizedAttrs);
		return $finalizedAttrs;
	});

	const deriveFlatColumnsFns: DeriveFlatColumnsFn<Item>[] = Object.values(pluginInstances)
		.map((pluginInstance) => pluginInstance.deriveFlatColumns)
		.filter(nonUndefined);

	let visibleColumns = flatColumns;
	deriveFlatColumnsFns.forEach((fn) => {
		// Variance of generic type here is unstable. Not sure how to fix.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		visibleColumns = fn(visibleColumns as any) as any;
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
		_headerRows.set($headerRows);
		return $headerRows;
	});

	return {
		tableAttrs: finalizedTableAttrs,
		tableHeadAttrs: finalizedTableHeadAttrs,
		tableBodyAttrs: finalizedTableBodyAttrs,
		visibleColumns: injectedColumns,
		flatColumns: $flatColumns,
		headerRows,
		originalRows,
		rows: injectedRows,
		pageRows: injectedPageRows,
		pluginStates,
	};
};
