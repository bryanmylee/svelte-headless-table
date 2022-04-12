import type { Column, ColumnGroup, ColumnLeaf } from '$lib/types/Column';

/**
 * Get the data keys in the order of column access. This is the same as the
 * in-order traversal of leaf nodes in the column structure.
 * @param columns The column structure grouped by columns;
 * @returns A list of data keys in the order of column access.
 */
export const getLeafColumns = <Item extends object>(
	columns: Column<Item>[]
): ColumnLeaf<Item>[] => {
	const leafColumns: ColumnLeaf<Item>[] = [];
	columns.forEach((column) => {
		if ((column as ColumnLeaf<Item>).key !== undefined) {
			leafColumns.push(column as ColumnLeaf<Item>);
		} else {
			const group = column as ColumnGroup<Item>;
			leafColumns.push(...getLeafColumns(group.columns));
		}
	});
	return leafColumns;
};
