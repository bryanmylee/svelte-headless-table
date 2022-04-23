import {
	HeaderDataCell,
	HeaderGroupCell,
	HeaderBlankCell,
	type HeaderCell,
} from '$lib/models/HeaderCell';
import { sum } from './math';
import { DataColumn, GroupColumn, type Column } from '$lib/models/Column';
import { HeaderRow } from '$lib/models/HeaderRow';
import type { TableInstance } from '$lib/models/TableInstance';

/**
 * Transform the column representation of the table headers into rows in the table head.
 * @param columns The column structure grouped by columns.
 * @returns A list of header groups representing rows in the table head.
 */
export const getHeaderRows = <Item extends object>(
	table: TableInstance<Item>,
	columns: Column<Item>[]
): HeaderRow<Item>[] => {
	const rowsData = _getHeaderRowsData(table, columns);
	const rows = rowsData.map((row) => new HeaderRow(row));
	return rows;
};

const _getHeaderRowsData = <Item extends object>(
	table: TableInstance<Item>,
	columns: Column<Item>[]
): HeaderRow<Item>[] => {
	/**
	 * Map each column to a list of header rows.
	 * The number of rows depends on the depth of nested columns in each column.
	 *
	 * columns: {...}        {...}        {...}
	 * groups:  [[..] [..]]  [[..]]       [[..] [..] [..]]
	 */
	const columnGroups: HeaderRow<Item>[][] = columns.map((column) => {
		if (column instanceof DataColumn) {
			return [
				{
					cells: [
						new HeaderDataCell({
							table,
							key: (column as DataColumn<Item>).key,
							label: column.header,
						}),
					],
				},
			];
		} else if (column instanceof GroupColumn) {
			/**
			 * Get the rows representing this column.
			 *
			 * column: {...}
			 * rows:   [[..] [..]]
			 */
			const rows = _getHeaderRowsData(table, column.columns);
			/**
			 * The colspan of this group is the sum of colspans of the row directly below.
			 */
			const colspan = sum(...rows[0].cells.map(({ colspan }) => colspan));
			/**
			 * The key of this group is the set of keys of the row directly below.
			 */
			const key = rows[0].cells.flatMap(({ key }) => (Array.isArray(key) ? key : [key]));
			/**
			 * Add this group on top of child column rows.
			 */
			return [
				{
					cells: [
						new HeaderGroupCell({
							table,
							colspan,
							label: column.header,
							key,
						}),
					],
				},
				...rows,
			];
		} else {
			throw new Error('invalid Column subclass');
		}
	});

	const height = Math.max(...columnGroups.map((rows) => rows.length));
	const colspan = sum(
		...columnGroups.map((rows) => sum(...rows[0].cells.map((firstRowCell) => firstRowCell.colspan)))
	);

	/**
	 * Create a grid of blank header cells.
	 */
	type HeaderRowMaybeItem<Item extends object> =
		| HeaderRow<Item>
		| { cells: (HeaderCell<Item> | undefined)[] };
	const resultRows: HeaderRowMaybeItem<Item>[] = [];
	for (let i = 0; i < height; i++) {
		resultRows.push({ cells: Array(colspan).fill(new HeaderBlankCell({ table })) });
	}

	/**
	 * Populate the header cells.
	 */
	let groupColumnOffset = 0;
	columnGroups.forEach((rows) => {
		const numBlankRows = height - rows.length;
		rows.forEach((row, rowIdx) => {
			let columnOffset = 0;
			row.cells.forEach((cell) => {
				resultRows[numBlankRows + rowIdx].cells[groupColumnOffset + columnOffset] = cell;
				/**
				 * Set cells to be merged as undefined.
				 */
				for (let blankOffset = 1; blankOffset < cell.colspan; blankOffset++) {
					resultRows[numBlankRows + rowIdx].cells[groupColumnOffset + columnOffset + blankOffset] =
						undefined;
				}
				columnOffset += cell.colspan;
			});
		});
		groupColumnOffset += sum(...rows[0].cells.map((firstRowCell) => firstRowCell.colspan));
	});

	/**
	 * Remove undefined elements.
	 */
	const noUndefinedCells = resultRows.map((row) => ({
		cells: row.cells.filter((cell) => cell !== undefined),
	})) as HeaderRow<Item>[];

	return noUndefinedCells;
};
