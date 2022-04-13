import {
	HeaderDataCell,
	HeaderGroupCell,
	HEADER_BLANK,
	type HeaderCell,
} from '$lib/models/HeaderCell';
import { sum } from './math';
import type { ColumnData } from '$lib/models/Column';
import { HeaderRow } from '$lib/models/HeaderRow';

/**
 * Transform the column representation of the table headers into rows in the table head.
 * @param columns The column structure grouped by columns.
 * @returns A list of header groups representing rows in the table head.
 */
export const getHeaderRows = <Item extends object>(
	columns: ColumnData<Item>[]
): HeaderRow<Item>[] => {
	const rowsData = _getHeaderRowsData(columns);
	const rows = rowsData.map((row) => new HeaderRow(row));
	return rows;
};

const _getHeaderRowsData = <Item extends object>(
	columns: ColumnData<Item>[]
): HeaderRow<Item>[] => {
	/**
	 * Map each column to a list of header rows.
	 * The number of rows depends on the depth of nested columns in each column.
	 *
	 * columns: {...}        {...}        {...}
	 * groups:  [[..] [..]]  [[..]]       [[..] [..] [..]]
	 */
	const columnGroups: HeaderRow<Item>[][] = columns.map((column) => {
		if (column.type === 'data') {
			return [
				{
					cells: [
						new HeaderDataCell({
							key: column.key,
							label: column.header,
						}),
					],
				},
			];
		} else {
			/**
			 * Get the rows representing this column.
			 *
			 * column: {...}
			 * rows:   [[..] [..]]
			 */
			const rows = _getHeaderRowsData(column.columns);
			/**
			 * The colspan of this group is the sum of colspans of the row directly below.
			 */
			const colspan = sum(...rows[0].cells.map((firstRowCell) => firstRowCell.colspan));
			/**
			 * Add this group on top of child column rows.
			 */
			return [
				{
					cells: [
						new HeaderGroupCell({
							colspan,
							label: column.header,
						}),
					],
				},
				...rows,
			];
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
		| { cells: Maybe<HeaderCell<Item>>[] };
	const resultRows: HeaderRowMaybeItem<Item>[] = [];
	for (let i = 0; i < height; i++) {
		resultRows.push({ cells: Array(colspan).fill(HEADER_BLANK) });
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
