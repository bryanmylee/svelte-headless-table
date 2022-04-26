import { DataColumn, GroupColumn, type Column } from './columns';
import { DataHeaderCell, DisplayHeaderCell, GroupHeaderCell, type HeaderCell } from './headerCells';
import type { ColumnOrder, ColumnFilter } from './types/config';
import type { Matrix } from './types/Matrix';
import { getCloned } from './utils/clone';
import { max, sum } from './utils/math';
import { getNullMatrix, getTransposed } from './utils/matrix';

export interface HeaderRowInit<Item> {
	id: string;
	cells: Array<HeaderCell<Item>>;
}

export class HeaderRow<Item> {
	id: string;
	cells: Array<HeaderCell<Item>>;
	constructor({ id, cells }: HeaderRowInit<Item>) {
		this.id = id;
		this.cells = cells;
	}
}

export type GetHeaderRowsConfig<Item> = ColumnOrder<Item> & ColumnFilter<Item>;

export const getHeaderRows = <Item>(
	columns: Array<Column<Item>>,
	{ columnOrder, hiddenColumns }: GetHeaderRowsConfig<Item> = {}
): Array<HeaderRow<Item>> => {
	const rowMatrix = getHeaderRowMatrix(columns);
	// Perform all column operations on the transposed columnMatrix. This helps
	// to reduce the number of expensive transpose operations required.
	let columnMatrix = getTransposed(rowMatrix);
	if (columnOrder !== undefined) {
		columnMatrix = getOrderedColumnMatrix(columnMatrix, columnOrder);
	}
	if (hiddenColumns !== undefined) {
		columnMatrix = getFilteredColumnMatrix(columnMatrix, hiddenColumns);
	}
	populateGroupHeaderCellIds(columnMatrix);
	return rowMatrixToHeaderRows(getTransposed(columnMatrix));
};

export const getHeaderRowMatrix = <Item>(
	columns: Array<Column<Item>>
): Matrix<HeaderCell<Item>> => {
	const maxColspan = sum(columns.map((c) => (c instanceof GroupColumn ? c.ids.length : 1)));
	const maxHeight = max(columns.map((c) => c.height));
	const rowMatrix: Matrix<HeaderCell<Item> | null> = getNullMatrix(maxColspan, maxHeight);
	let cellOffset = 0;
	columns.forEach((c) => {
		const heightOffset = maxHeight - c.height;
		loadHeaderRowMatrix(rowMatrix, c, heightOffset, cellOffset);
		cellOffset += c instanceof GroupColumn ? c.ids.length : 1;
	});
	// Replace null cells with blank display cells.
	return rowMatrix.map((cells) =>
		cells.map((cell, columnIdx) => cell ?? new DisplayHeaderCell({ id: columnIdx.toString() }))
	);
};

const loadHeaderRowMatrix = <Item>(
	rowMatrix: Matrix<HeaderCell<Item> | undefined | null>,
	column: Column<Item>,
	rowOffset: number,
	cellOffset: number
) => {
	if (column instanceof DataColumn) {
		// `DataHeaderCell` should always be in the last row.
		rowMatrix[rowMatrix.length - 1][cellOffset] = new DataHeaderCell({
			label: column.header,
			accessorFn: column.accessorFn,
			accessorKey: column.accessorKey,
			id: column.id,
		});
		return;
	}
	if (column instanceof GroupColumn) {
		// Fill multi-colspan cells.
		for (let i = 0; i < column.ids.length; i++) {
			rowMatrix[rowOffset][cellOffset + i] = new GroupHeaderCell({
				label: column.header,
				colspan: 1,
				allIds: column.ids,
				ids: [],
			});
		}
		let childCellOffset = 0;
		column.columns.forEach((c) => {
			loadHeaderRowMatrix(rowMatrix, c, rowOffset + 1, cellOffset + childCellOffset);
			childCellOffset += c instanceof GroupColumn ? c.ids.length : 1;
		});
		return;
	}
};

export const getOrderedColumnMatrix = <Item>(
	columnMatrix: Matrix<HeaderCell<Item>>,
	columnOrder: Array<string>
): Matrix<HeaderCell<Item>> => {
	if (columnOrder.length === 0) {
		return columnMatrix;
	}
	const orderedColumnMatrix: Matrix<HeaderCell<Item>> = [];
	// Each row of the transposed matrix represents a column.
	// The `DataHeaderCell` is the last cell of each column.
	columnOrder.forEach((key) => {
		const nextColumn = columnMatrix.find((columnCells) => {
			const dataCell = columnCells[columnCells.length - 1];
			if (!(dataCell instanceof DataHeaderCell)) {
				throw new Error('The last element of each column must be `DataHeaderCell`');
			}
			return dataCell.id === key;
		});
		if (nextColumn !== undefined) {
			orderedColumnMatrix.push(nextColumn);
		}
	});
	return orderedColumnMatrix;
};

export const getFilteredColumnMatrix = <Item>(
	columnMatrix: Matrix<HeaderCell<Item>>,
	hiddenColumns: Array<string>
): Matrix<HeaderCell<Item>> => {
	// Each row of the transposed matrix represents a column.
	// The `DataHeaderCell` is the last cell of each column.
	return columnMatrix.filter((columnCells) => {
		const dataCell = columnCells[columnCells.length - 1];
		if (!(dataCell instanceof DataHeaderCell)) {
			throw new Error('The last element of each column must be `DataHeaderCell`');
		}
		return !hiddenColumns.includes(dataCell.id);
	});
};

const populateGroupHeaderCellIds = <Item>(columnMatrix: Matrix<HeaderCell<Item>>) => {
	columnMatrix.forEach((columnCells) => {
		const dataCell = columnCells[columnCells.length - 1];
		if (!(dataCell instanceof DataHeaderCell)) {
			throw new Error('The last element of each column must be `DataHeaderCell`');
		}
		columnCells.forEach((c) => {
			if (c instanceof GroupHeaderCell) {
				c.ids.push(dataCell.id);
				c.id = c.ids.join(',');
			}
		});
	});
};

export const rowMatrixToHeaderRows = <Item>(
	rowMatrix: Matrix<HeaderCell<Item>>
): Array<HeaderRow<Item>> => {
	return rowMatrix.map((rowCells, rowIdx) => {
		return new HeaderRow({ id: rowIdx.toString(), cells: getMergedRow(rowCells) });
	});
};

/**
 * Multi-colspan cells will appear as multiple adjacent cells on the same row.
 * Join these adjacent multi-colspan cells and update the colspan property.
 *
 * Non-adjacent multi-colspan cells (due to column ordering) must be cloned
 * from the original .
 *
 * @param cells An array of cells.
 * @returns An array of cells with no duplicate consecutive cells.
 */
export const getMergedRow = <Item>(cells: Array<HeaderCell<Item>>): Array<HeaderCell<Item>> => {
	if (cells.length === 0) {
		return cells;
	}
	const mergedCells: Array<HeaderCell<Item>> = [];
	let startIdx = 0;
	let endIdx = 1;
	while (startIdx < cells.length) {
		const cell = getCloned(cells[startIdx]);
		if (!(cell instanceof GroupHeaderCell)) {
			mergedCells.push(cell);
			startIdx++;
			continue;
		}
		endIdx = startIdx + 1;
		const ids: Array<string> = [...cell.ids];
		while (endIdx < cells.length) {
			const nextCell = cells[endIdx];
			if (!(nextCell instanceof GroupHeaderCell)) {
				break;
			}
			if (cell.allId !== nextCell.allId) {
				break;
			}
			ids.push(...nextCell.ids);
			endIdx++;
		}
		cell.ids = ids;
		cell.id = ids.join(',');
		cell.colspan = endIdx - startIdx;
		mergedCells.push(cell);
		startIdx = endIdx;
	}
	return mergedCells;
};
