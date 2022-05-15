import { DataColumn, DisplayColumn, GroupColumn, type Column } from './columns';
import {
	DataHeaderCell,
	DisplayHeaderCell,
	FlatHeaderCell,
	GroupHeaderCell,
	type HeaderCell,
} from './headerCells';
import { TableComponent } from './tableComponent';
import type { Matrix } from './types/Matrix';
import type { AnyPlugins } from './types/TablePlugin';
import { getCloned } from './utils/clone';
import { sum } from './utils/math';
import { getNullMatrix, getTransposed } from './utils/matrix';

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface HeaderRowAttributes<Item, Plugins extends AnyPlugins = AnyPlugins> {}

export interface HeaderRowInit<Item, Plugins extends AnyPlugins = AnyPlugins> {
	id: string;
	cells: HeaderCell<Item, Plugins>[];
}

export class HeaderRow<Item, Plugins extends AnyPlugins = AnyPlugins> extends TableComponent<
	Item,
	Plugins,
	'tbody.tr'
> {
	cells: HeaderCell<Item, Plugins>[];
	constructor({ id, cells }: HeaderRowInit<Item, Plugins>) {
		super({ id });
		this.cells = cells;
	}
}

export const getHeaderRows = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	columns: Column<Item, Plugins>[],
	flatColumnIds: string[] = []
): HeaderRow<Item, Plugins>[] => {
	const rowMatrix = getHeaderRowMatrix(columns);
	// Perform all column operations on the transposed columnMatrix. This helps
	// to reduce the number of expensive transpose operations required.
	let columnMatrix = getTransposed(rowMatrix);
	columnMatrix = getOrderedColumnMatrix(columnMatrix, flatColumnIds);
	populateGroupHeaderCellIds(columnMatrix);
	return headerRowsForRowMatrix(getTransposed(columnMatrix));
};

export const getHeaderRowMatrix = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	columns: Column<Item, Plugins>[]
): Matrix<HeaderCell<Item, Plugins>> => {
	const maxColspan = sum(columns.map((c) => (c instanceof GroupColumn ? c.ids.length : 1)));
	const maxHeight = Math.max(...columns.map((c) => c.height));
	const rowMatrix: Matrix<HeaderCell<Item, Plugins> | null> = getNullMatrix(maxColspan, maxHeight);
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

const loadHeaderRowMatrix = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	rowMatrix: Matrix<HeaderCell<Item, Plugins> | undefined | null>,
	column: Column<Item, Plugins>,
	rowOffset: number,
	cellOffset: number
) => {
	if (column instanceof DataColumn) {
		// `DataHeaderCell` should always be in the last row.
		rowMatrix[rowMatrix.length - 1][cellOffset] = new DataHeaderCell({
			label: column.header,
			accessorFn: column.accessorFn,
			accessorKey: column.accessorKey as keyof Item,
			id: column.id,
		});
		return;
	}
	if (column instanceof DisplayColumn) {
		rowMatrix[rowMatrix.length - 1][cellOffset] = new DisplayHeaderCell({
			id: column.id,
			label: column.header,
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

export const getOrderedColumnMatrix = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	columnMatrix: Matrix<HeaderCell<Item, Plugins>>,
	flatColumnIds: string[]
): Matrix<HeaderCell<Item, Plugins>> => {
	if (flatColumnIds.length === 0) {
		return columnMatrix;
	}
	const orderedColumnMatrix: Matrix<HeaderCell<Item, Plugins>> = [];
	// Each row of the transposed matrix represents a column.
	// The `FlatHeaderCell` should be the last cell of each column.
	flatColumnIds.forEach((key) => {
		const nextColumn = columnMatrix.find((columnCells) => {
			const flatCell = columnCells[columnCells.length - 1];
			if (!(flatCell instanceof FlatHeaderCell)) {
				throw new Error('The last element of each column must be a `FlatHeaderCell`');
			}
			return flatCell.id === key;
		});
		if (nextColumn !== undefined) {
			orderedColumnMatrix.push(nextColumn);
		}
	});
	return orderedColumnMatrix;
};

const populateGroupHeaderCellIds = <Item>(columnMatrix: Matrix<HeaderCell<Item>>) => {
	columnMatrix.forEach((columnCells) => {
		const lastCell = columnCells[columnCells.length - 1];
		if (!(lastCell instanceof FlatHeaderCell)) {
			throw new Error('The last element of each column must be a `FlatHeaderCell`');
		}
		columnCells.forEach((c) => {
			if (c instanceof GroupHeaderCell) {
				c.pushId(lastCell.id);
			}
		});
	});
};

export const headerRowsForRowMatrix = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	rowMatrix: Matrix<HeaderCell<Item, Plugins>>
): HeaderRow<Item, Plugins>[] => {
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
export const getMergedRow = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	cells: HeaderCell<Item, Plugins>[]
): HeaderCell<Item, Plugins>[] => {
	if (cells.length === 0) {
		return cells;
	}
	const mergedCells: HeaderCell<Item, Plugins>[] = [];
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
		const ids: string[] = [...cell.ids];
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
		cell.setIds(ids);
		cell.colspan = endIdx - startIdx;
		mergedCells.push(cell);
		startIdx = endIdx;
	}
	return mergedCells;
};
