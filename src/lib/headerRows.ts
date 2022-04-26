import { DataColumn, GroupColumn, type Column } from './columns';
import { DataHeaderCell, DisplayHeaderCell, GroupHeaderCell, type HeaderCell } from './headerCells';
import type { Matrix } from './types/Matrix';
import { getCloned } from './utils/clone';
import { max, sum } from './utils/math';
import { getNullMatrix, getTransposed } from './utils/matrix';

export interface HeaderRowInit<Item> {
	cells: Array<HeaderCell<Item>>;
}

export class HeaderRow<Item> {
	cells: Array<HeaderCell<Item>>;
	constructor({ cells }: HeaderRowInit<Item>) {
		this.cells = cells;
	}
}

export interface GetHeaderRowsConfig<Item> {
	columnOrder?: Array<string>;
	hiddenColumns?: Array<string>;
}

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
	return rowMatrixToHeaderRows(getTransposed(columnMatrix));
};

export const getHeaderRowMatrix = <Item>(
	columns: Array<Column<Item>>
): Matrix<HeaderCell<Item>> => {
	const maxColspan = sum(columns.map((c) => (c instanceof GroupColumn ? c.ids.length : 1)));
	const maxHeight = max(columns.map((c) => c.height));
	const cellMatrix: Matrix<HeaderCell<Item> | null> = getNullMatrix(maxColspan, maxHeight);
	let cellOffset = 0;
	columns.forEach((c) => {
		const heightOffset = maxHeight - c.height;
		loadHeaderRowMatrix(cellMatrix, c, heightOffset, cellOffset);
		cellOffset += c instanceof GroupColumn ? c.ids.length : 1;
	});
	// Replace null cells with blank display cells.
	return cellMatrix.map((cells) => cells.map((cell) => cell ?? new DisplayHeaderCell()));
};

const loadHeaderRowMatrix = <Item>(
	cellMatrix: Matrix<HeaderCell<Item> | undefined | null>,
	column: Column<Item>,
	rowOffset: number,
	cellOffset: number
) => {
	if (column instanceof DataColumn) {
		// `DataHeaderCell` should always be in the last row.
		cellMatrix[cellMatrix.length - 1][cellOffset] = new DataHeaderCell({
			label: column.header,
			accessorFn: column.accessorFn,
			accessorKey: column.accessorKey,
			id: column.id,
		});
		return;
	}
	if (column instanceof GroupColumn) {
		const groupCell = new GroupHeaderCell({
			label: column.header,
			colspan: 1,
			ids: column.ids,
		});
		// Fill multi-colspan cells.
		for (let i = 0; i < column.ids.length; i++) {
			cellMatrix[rowOffset][cellOffset + i] = groupCell;
		}
		let childCellOffset = 0;
		column.columns.forEach((c) => {
			loadHeaderRowMatrix(cellMatrix, c, rowOffset + 1, cellOffset + childCellOffset);
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
		const nextColumn = columnMatrix.find((cells) => {
			const lastCell = cells[cells.length - 1];
			if (!(lastCell instanceof DataHeaderCell)) {
				return false;
			}
			return lastCell.id === key;
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
	return columnMatrix.filter((column) => {
		const lastCell = column[column.length - 1];
		if (!(lastCell instanceof DataHeaderCell)) {
			return true;
		}
		return !hiddenColumns.includes(lastCell.id);
	});
};

export const rowMatrixToHeaderRows = <Item>(
	rowMatrix: Matrix<HeaderCell<Item>>
): Array<HeaderRow<Item>> => {
	return rowMatrix.map((cells) => {
		return new HeaderRow({ cells: getMergedRow(cells) });
	});
};

/**
 * Multi-colspan cells will appear as multiple adjacent cells on the same row.
 * Join these adjacent multi-colspan cells and update the colspan property.
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
		// The comparison works because each cell is a reference to the same instance.
		while (endIdx <= cells.length && cells[endIdx] === cells[startIdx]) {
			endIdx++;
		}
		let cell = cells[startIdx];
		if (cell instanceof GroupHeaderCell) {
			cell = getCloned(cell);
			cell.colspan = endIdx - startIdx;
		}
		mergedCells.push(cell);
		startIdx = endIdx;
		endIdx = startIdx + 1;
	}
	return mergedCells;
};
