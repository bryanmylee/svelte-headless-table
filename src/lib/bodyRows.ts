import { BodyCell } from './bodyCells';
import type { DataColumn } from './columns';
import type { SortKey } from './types/config';
import { compare } from './utils/compare';

export interface BodyRowInit<Item> {
	id: string;
	cells: Array<BodyCell<Item>>;
}

export class BodyRow<Item> {
	id: string;
	cells: Array<BodyCell<Item>>;
	constructor({ id, cells }: BodyRowInit<Item>) {
		this.id = id;
		this.cells = cells;
	}
}

export const getBodyRows = <Item>(
	data: Array<Item>,
	flatColumns: Array<DataColumn<Item>>
): Array<BodyRow<Item>> => {
	const rows: Array<BodyRow<Item>> = [];
	for (let i = 0; i < data.length; i++) {
		rows.push(new BodyRow({ id: i.toString(), cells: [] }));
	}
	data.forEach((item, rowIdx) => {
		const cells = flatColumns.map((c) => {
			const value =
				c.accessorFn !== undefined
					? c.accessorFn(item)
					: c.accessorKey !== undefined
					? item[c.accessorKey]
					: undefined;
			return new BodyCell({ row: rows[rowIdx], column: c, label: c.cell, value });
		});
		rows[rowIdx].cells = cells;
	});
	return rows;
};

export const getSortedBodyRows = <Item>(
	originalRows: Array<BodyRow<Item>>,
	sortKeys: Array<SortKey>
): Array<BodyRow<Item>> => {
	if (sortKeys.length === 0 || originalRows.length === 0) {
		return originalRows;
	}
	const rowCells = originalRows[0].cells;
	const colIdToIdx: Record<string, number> = {};
	for (let i = 0; i < rowCells.length; i++) {
		colIdToIdx[rowCells[i].column.id] = i;
	}

	const rows = [...originalRows];
	rows.sort((a, b) => {
		for (const key of sortKeys) {
			const idx = colIdToIdx[key.id];
			if (idx === undefined) {
				continue;
			}
			const cellA = a.cells[idx];
			const cellB = b.cells[idx];
			let order = 0;
			// Only need to check properties of `cellA` as both should have the same
			// properties.
			if (cellA.column.sortOnFn !== undefined) {
				const sortOnFn = cellA.column.sortOnFn;
				const sortOnA = sortOnFn(cellA.value);
				const sortOnB = sortOnFn(cellB.value);
				order = compare(sortOnA, sortOnB);
			} else if (typeof cellA.value === 'string' || typeof cellA.value === 'number') {
				// typeof `cellB.value` is logically equal to `cellA.value`.
				order = compare(cellA.value, cellB.value as string | number);
			}
			if (order !== 0) {
				return key.order === 'asc' ? order : -order;
			}
		}
		return 0;
	});
	return rows;
};
