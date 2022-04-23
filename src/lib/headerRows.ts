import { DataColumn, GroupColumn, type Column } from './columns';
import { HeaderDataCell, HeaderDisplayCell, HeaderGroupCell, type HeaderCell } from './headerCells';
import { max, sum } from './utils/math';
import { nonNullish } from './utils/filter';

export interface HeaderRowInit<Item> {
	cells: Array<HeaderCell<Item>>;
}

export class HeaderRow<Item> {
	cells: Array<HeaderCell<Item>>;
	constructor({ cells }: HeaderRowInit<Item>) {
		this.cells = cells;
	}
}

type Matrix<T> = Array<Array<T>>;

export const getHeaderRows = <Item>(columns: Array<Column<Item>>): Array<HeaderRow<Item>> => {
	const maxColspan = sum(columns.map((c) => c.colspan));
	const maxHeight = max(columns.map((c) => c.height));
	const cellMatrix: Matrix<HeaderCell<Item> | undefined | null> = [];
	// Use a loop to create a new array instance per row.
	for (let i = 0; i < maxHeight; i++) {
		cellMatrix.push(Array(maxColspan).fill(null));
	}
	let cellOffset = 0;
	columns.forEach((c) => {
		const heightOffset = maxHeight - c.height;
		loadHeaderCells(cellMatrix, c, heightOffset, cellOffset);
		cellOffset += c.colspan;
	});
	// Mark null cells that trail multi-colspan cells as undefined.
	cellMatrix.forEach((cells) => {
		cells.forEach((cell, colIdx) => {
			if (cell == null) {
				return;
			}
			for (let i = 1; i < cell.colspan; i++) {
				cells[colIdx + i] = undefined;
			}
		});
	});
	// Replace null cells with blank display cells and filter undefined cells.
	return cellMatrix.map(
		(cells) =>
			new HeaderRow({
				cells: cells
					.map((cell) => (cell === null ? new HeaderDisplayCell() : cell))
					.filter(nonNullish),
			})
	);
};

export const loadHeaderCells = <Item>(
	cellMatrix: Matrix<HeaderCell<Item> | undefined | null>,
	column: Column<Item>,
	rowOffset: number,
	cellOffset: number
) => {
	if (column instanceof DataColumn) {
		cellMatrix[rowOffset][cellOffset] = new HeaderDataCell({
			label: column.header,
			accessorFn: column.accessorFn,
			accessorKey: column.accessorKey,
		});
		return;
	}
	if (column instanceof GroupColumn) {
		cellMatrix[rowOffset][cellOffset] = new HeaderGroupCell({
			label: column.header,
			colspan: column.colspan,
		});
		let subcellOffset = 0;
		column.columns.forEach((c) => {
			loadHeaderCells(cellMatrix, c, rowOffset + 1, cellOffset + subcellOffset);
			subcellOffset += c.colspan;
		});
		return;
	}
};
