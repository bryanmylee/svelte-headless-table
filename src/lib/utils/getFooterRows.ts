import type { Column } from '$lib/types/Column';
import { FOOTER_BLANK, type FooterCell } from '$lib/types/FooterCell';
import { sum } from './math';

export const getFooterRows = <Item extends object>(
	columns: Column<Item>[]
): FooterCell<Item>[][] => {
	const rows = _getFooterRows(columns);
	/**
	 * Remove rows with all blanks.
	 */
	return rows.filter((row) => row.some((cell) => cell.type !== 'blank'));
};

const _getFooterRows = <Item extends object>(columns: Column<Item>[]): FooterCell<Item>[][] => {
	/**
	 * Map each column to a list of footer rows.
	 * The number of rows depends on the depth of nested columns in each column.
	 *
	 * columns: {...}        {...}        {...}
	 * groups:  [[..] [..]]  [[..]]       [[..] [..] [..]]
	 */
	const columnGroups: FooterCell<Item>[][][] = columns.map((column) => {
		if (column.type === 'data') {
			if (column.footer === undefined) {
				return [[FOOTER_BLANK]];
			}
			return [
				[
					{
						type: 'data',
						colspan: 1,
						key: column.key,
						label: column.footer,
					},
				],
			];
		} else {
			/**
			 * Get the rows representing this column.
			 *
			 * column: {...}
			 * rows:   [[..] [..]]
			 */
			const rows = _getFooterRows(column.columns);

			/**
			 * The colspan of this group is the sum of colspans of the row directly below.
			 */
			const colspan = sum(...rows[0].map((firstRowCell) => firstRowCell.colspan));

			/**
			 * Add this group on top of child column rows.
			 */

			if (column.footer === undefined) {
				return [Array(colspan).fill(FOOTER_BLANK), ...rows];
			}
			return [
				[
					{
						type: 'group',
						colspan,
						label: column.footer,
					},
				],
				...rows,
			];
		}
	});

	const height = Math.max(...columnGroups.map((rows) => rows.length));
	const colspan = sum(
		...columnGroups.map((rows) => sum(...rows[0].map((firstRowCell) => firstRowCell.colspan)))
	);
	/**
	 * Create a grid of blank header cells.
	 */
	const resultRows: Maybe<FooterCell<Item>>[][] = [];
	for (let i = 0; i < height; i++) {
		resultRows.push(Array(colspan).fill(FOOTER_BLANK));
	}

	/**
	 * Populate the header cells.
	 */
	let groupColumnOffset = 0;
	columnGroups.forEach((rows) => {
		const numBlankRows = height - rows.length;
		rows.forEach((row, rowIdx) => {
			let columnOffset = 0;
			row.forEach((cell) => {
				resultRows[numBlankRows + rowIdx][groupColumnOffset + columnOffset] = cell;
				/**
				 * Set cells to be merged as undefined.
				 */
				for (let blankOffset = 1; blankOffset < cell.colspan; blankOffset++) {
					resultRows[numBlankRows + rowIdx][groupColumnOffset + columnOffset + blankOffset] =
						undefined;
				}
				columnOffset += cell.colspan;
			});
		});
		groupColumnOffset += sum(...rows[0].map((firstRowCell) => firstRowCell.colspan));
	});

	/**
	 * Flip the row order.
	 */
	resultRows.reverse();

	/**
	 * Remove undefined elements.
	 */
	const noUndefinedCells = resultRows.map((row) =>
		row.filter((cell) => cell !== undefined)
	) as FooterCell<Item>[][];

	return noUndefinedCells;
};
