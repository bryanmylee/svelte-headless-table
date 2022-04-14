import { DataColumn, GroupColumn, type Column } from '$lib/models/Column';
import {
	FooterBlankCell,
	FooterDataCell,
	FooterGroupCell,
	type FooterCell,
} from '$lib/models/FooterCell';
import { FooterRow } from '$lib/models/FooterRow';
import type { TableInstance } from '$lib/models/TableInstance';
import { sum } from './math';

export const getFooterRows = <Item extends object>(
	table: TableInstance<Item>,
	columns: Column<Item>[]
): FooterRow<Item>[] => {
	const rowsData = _getFooterRows(table, columns);
	/**
	 * Remove rows with all blanks.
	 */
	const noBlanksRowsData = rowsData.filter((row) =>
		row.cells.some((cell) => !(cell instanceof FooterBlankCell))
	);
	return noBlanksRowsData.map((row) => new FooterRow(row));
};

const _getFooterRows = <Item extends object>(
	table: TableInstance<Item>,
	columns: Column<Item>[]
): FooterRow<Item>[] => {
	/**
	 * Map each column to a list of footer rows.
	 * The number of rows depends on the depth of nested columns in each column.
	 *
	 * columns: {...}        {...}        {...}
	 * groups:  [[..] [..]]  [[..]]       [[..] [..] [..]]
	 */
	const columnGroups: FooterRow<Item>[][] = columns.map((column) => {
		if (column instanceof DataColumn) {
			if (column.footer === undefined) {
				return [
					{
						cells: [new FooterBlankCell({ table })],
					},
				];
			}
			return [
				{
					cells: [
						new FooterDataCell({
							table,
							key: (column as DataColumn<Item>).key,
							label: column.footer,
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
			const rows = _getFooterRows(table, column.columns);

			/**
			 * The colspan of this group is the sum of colspans of the row directly below.
			 */
			const colspan = sum(...rows[0].cells.map((firstRowCell) => firstRowCell.colspan));

			/**
			 * Add this group on top of child column rows.
			 */

			if (column.footer === undefined) {
				return [
					{
						cells: Array(colspan).fill(new FooterBlankCell({ table })),
					},
					...rows,
				];
			}
			return [
				{
					cells: [
						new FooterGroupCell({
							table,
							colspan,
							label: column.footer,
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
	type FooterRowMaybeItem<Item extends object> =
		| FooterRow<Item>
		| { cells: Maybe<FooterCell<Item>>[] };
	const resultRows: FooterRowMaybeItem<Item>[] = [];
	for (let i = 0; i < height; i++) {
		resultRows.push({ cells: Array(colspan).fill(new FooterBlankCell({ table })) });
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
	 * Flip the row order.
	 */
	resultRows.reverse();

	/**
	 * Remove undefined elements.
	 */
	const noUndefinedCells = resultRows.map((row) => ({
		cells: row.cells.filter((cell) => cell !== undefined),
	})) as FooterRow<Item>[];

	return noUndefinedCells;
};
