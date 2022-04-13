import type { ColumnDef, ColumnGroupDef, ColumnLeafDef } from '$lib/types/ColumnDef';

/**
 * Get the data keys in the order of column access. This is the same as the
 * in-order traversal of leaf nodes in the column structure.
 * @param columns The column structure grouped by columns;
 * @returns A list of data keys in the order of column access.
 */
export const getLeafColumns = <Item extends object>(
	columns: ColumnDef<Item>[]
): ColumnLeafDef<Item>[] => {
	const leafColumns: ColumnLeafDef<Item>[] = [];
	columns.forEach((column) => {
		if ((column as ColumnLeafDef<Item>).key !== undefined) {
			leafColumns.push(column as ColumnLeafDef<Item>);
		} else {
			const group = column as ColumnGroupDef<Item>;
			leafColumns.push(...getLeafColumns(group.columns));
		}
	});
	return leafColumns;
};
