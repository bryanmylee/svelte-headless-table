import type { HeaderBlank, Header } from '$lib/types/Header';
import { sum } from './math';
import { NBSP } from '../constants';
import type { Column } from '$lib/types/Column';

/**
 * Transform the column representation of the table headers into rows in the table head.
 * @param columns The column structure grouped by columns.
 * @returns A list of header groups representing rows in the table head.
 */
export const getHeaderRows = <Item extends object>(columns: Column<Item>[]): Header<Item>[][] => {
	/**
	 * Map each column to a list of header rows.
	 * The number of rows depends on the depth of nested columns in each column.
	 *
	 * columns: {...}        {...}        {...}
	 * groups:  [[..] [..]]  [[..]]       [[..] [..] [..]]
	 */
	const columnGroups: Header<Item>[][][] = columns.map((column) => {
		if (column.type === 'data') {
			return [
				[
					{
						type: 'data',
						colspan: 1,
						key: column.key,
						header: column.header,
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
			const rows = getHeaderRows(column.columns);
			/**
			 * The colspan of this group is the sum of colspans of the row directly below.
			 */
			const colspan = sum(...rows[0].map((firstRowCell) => firstRowCell.colspan));
			/**
			 * Add this group on top of child column rows.
			 */
			return [
				[
					{
						type: 'group',
						colspan,
						header: column.header,
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
	const resultRows: Maybe<Header<Item>>[][] = [];
	for (let i = 0; i < height; i++) {
		resultRows.push(
			Array(colspan).fill({ colspan: 1, type: 'blank', header: NBSP } as HeaderBlank)
		);
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
	 * Remove undefined elements.
	 */
	return resultRows.map((row) => row.filter((cell) => cell !== undefined)) as Header<Item>[][];
};
