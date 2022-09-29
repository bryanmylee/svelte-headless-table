import type { BodyRow } from '../bodyRows';
import type { TablePlugin } from '../types/TablePlugin';
import { isReadable } from '../utils/store';
import { derived, get, type Readable } from 'svelte/store';

export type DataExportFormat = 'object' | 'json' | 'csv';
type ExportForFormat = {
	object: Record<string, unknown>[];
	json: string;
	csv: string;
};
export type DataExport<F extends DataExportFormat> = ExportForFormat[F];

export interface DataExportConfig<F extends DataExportFormat> {
	childrenKey?: string;
	format?: F;
}

export interface DataExportState<F extends DataExportFormat> {
	exportedData: Readable<DataExport<F>>;
}

export interface DataExportColumnOptions {
	exclude?: boolean;
}

const getObjectsFromRows = <Item>(
	rows: BodyRow<Item>[],
	ids: string[],
	childrenKey: string
): Record<string, unknown>[] => {
	return rows.map((row) => {
		const dataObject = Object.fromEntries(
			ids.map((id) => {
				const cell = row.cellForId[id];
				if (cell.isData()) {
					return [id, cell.value];
				}
				if (cell.isDisplay() && cell.column.data !== undefined) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					let data = cell.column.data(cell, row.state);
					if (isReadable(data)) {
						data = get(data);
					}
					return [id, data];
				}
				return [id, null];
			})
		);
		if (row.subRows !== undefined) {
			dataObject[childrenKey] = getObjectsFromRows(row.subRows, ids, childrenKey);
		}
		return dataObject;
	});
};

const getCsvFromRows = <Item>(rows: BodyRow<Item>[], ids: string[]): string => {
	const dataLines = rows.map((row) => {
		const line = ids.map((id) => {
			const cell = row.cellForId[id];
			if (cell.isData()) {
				return cell.value;
			}
			if (cell.isDisplay() && cell.column.data !== undefined) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				let data = cell.column.data(cell, row.state);
				if (isReadable(data)) {
					data = get(data);
				}
				return data;
			}
			return null;
		});
		return line.join(',');
	});
	const headerLine = ids.join(',');
	return headerLine + '\n' + dataLines.join('\n');
};

export const addDataExport =
	<Item, F extends DataExportFormat = 'object'>({
		format = 'object' as F,
		childrenKey = 'children',
	}: DataExportConfig<F> = {}): TablePlugin<Item, DataExportState<F>, DataExportColumnOptions> =>
	({ tableState, columnOptions }) => {
		const excludedIds = Object.entries(columnOptions)
			.filter(([, option]) => option.exclude === true)
			.map(([columnId]) => columnId);

		const { visibleColumns, rows } = tableState;

		const exportedIds = derived(visibleColumns, ($visibleColumns) =>
			$visibleColumns.map((c) => c.id).filter((id) => !excludedIds.includes(id))
		);

		const exportedData = derived([rows, exportedIds], ([$rows, $exportedIds]) => {
			switch (format) {
				case 'json':
					return JSON.stringify(
						getObjectsFromRows($rows, $exportedIds, childrenKey)
					) as DataExport<F>;
				case 'csv':
					return getCsvFromRows($rows, $exportedIds) as DataExport<F>;
				default:
					return getObjectsFromRows($rows, $exportedIds, childrenKey) as DataExport<F>;
			}
		});

		const pluginState: DataExportState<F> = { exportedData };

		return {
			pluginState,
		};
	};
