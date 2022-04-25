import { DataColumn, GroupColumn, type Column } from './columns';
import { HeaderDataCell, HeaderDisplayCell, HeaderGroupCell, type HeaderCell } from './headerCells';
import type { Matrix } from './types/Matrix';
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
}

export const getHeaderRows = <Item>(
	columns: Array<Column<Item>>,
	{ columnOrder }: GetHeaderRowsConfig<Item> = {}
): Array<HeaderRow<Item>> => {
	let cellMatrix = getHeaderCellMatrix(columns);
	if (columnOrder !== undefined) {
		cellMatrix = getOrderedCellMatrix(cellMatrix, columnOrder);
	}
	return cellMatrix.map((cells) => {
		return new HeaderRow({ cells: getMergedCells(cells) });
	});
};

export const getHeaderCellMatrix = <Item>(
	columns: Array<Column<Item>>
): Matrix<HeaderCell<Item>> => {
	const maxColspan = sum(columns.map((c) => (c instanceof GroupColumn ? c.ids.length : 1)));
	const maxHeight = max(columns.map((c) => c.height));
	const cellMatrix: Matrix<HeaderCell<Item> | null> = getNullMatrix(maxColspan, maxHeight);
	let cellOffset = 0;
	columns.forEach((c) => {
		const heightOffset = maxHeight - c.height;
		loadHeaderCellMatrix(cellMatrix, c, heightOffset, cellOffset);
		cellOffset += c instanceof GroupColumn ? c.ids.length : 1;
	});
	// Fill multi-colspan cells.
	cellMatrix.forEach((cells) => {
		for (let i = 0; i < cells.length; ) {
			const cell = cells[i];
			if (cell === null) {
				i++;
				continue;
			}
			for (let j = 1; j < cell.colspan; j++) {
				cells[i + j] = cell;
			}
			i += cell.colspan;
		}
	});
	// Replace null cells with blank display cells.
	return cellMatrix.map((cells) => cells.map((cell) => cell ?? new HeaderDisplayCell()));
};

const loadHeaderCellMatrix = <Item>(
	cellMatrix: Matrix<HeaderCell<Item> | undefined | null>,
	column: Column<Item>,
	rowOffset: number,
	cellOffset: number
) => {
	if (column instanceof DataColumn) {
		// `HeaderDataCell` should always be in the last row.
		cellMatrix[cellMatrix.length - 1][cellOffset] = new HeaderDataCell({
			label: column.header,
			accessorFn: column.accessorFn,
			accessorKey: column.accessorKey,
			id: column.id,
		});
		return;
	}
	if (column instanceof GroupColumn) {
		cellMatrix[rowOffset][cellOffset] = new HeaderGroupCell({
			label: column.header,
			colspan: 1,
			ids: column.ids,
		});
		let subcellOffset = 0;
		column.columns.forEach((c) => {
			loadHeaderCellMatrix(cellMatrix, c, rowOffset + 1, cellOffset + subcellOffset);
			subcellOffset += c instanceof GroupColumn ? c.ids.length : 1;
		});
		return;
	}
};

export const getOrderedCellMatrix = <Item>(
	cellMatrix: Matrix<HeaderCell<Item>>,
	columnOrder: Array<string>
): Matrix<HeaderCell<Item>> => {
	// Each row of the transposed matrix represents a column.
	// The `HeaderDataCell` is the last cell of each column.
	const columns = getTransposed(cellMatrix);
	const orderedColumns: Matrix<HeaderCell<Item>> = [];
	columnOrder.forEach((key) => {
		const nextColumn = columns.find((cells) => {
			const lastCell = cells[cells.length - 1];
			if (!(lastCell instanceof HeaderDataCell)) {
				return false;
			}
			return lastCell.id === key;
		});
		if (nextColumn !== undefined) {
			orderedColumns.push(nextColumn);
		}
	});
	return getTransposed(orderedColumns);
};

/**
 * Multi-colspan cells will appear as multiple adjacent cells on the same row.
 * Join these adjacent multi-colspan cells and update the colspan property.
 * @param cells An array of cells.
 * @returns An array of cells with no duplicate consecutive cells.
 */
export const getMergedCells = <Item>(cells: Array<HeaderCell<Item>>): Array<HeaderCell<Item>> => {
	if (cells.length === 0) {
		return cells;
	}
	let currentCell = cells[0];
	const mergedCells: Array<HeaderCell<Item>> = [currentCell];
	for (let i = 1; i < cells.length; i++) {
		if (cells[i] !== currentCell) {
			mergedCells.push(cells[i]);
		}
		currentCell = cells[i];
	}
	return mergedCells;
};
