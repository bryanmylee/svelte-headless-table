import { DataColumn, GroupColumn, type Column } from '$lib/models/Column';

/**
 * Get the data keys in the order of column access. This is the same as the
 * in-order traversal of leaf nodes in the column structure.
 * @param columns The column structure grouped by columns;
 * @returns A list of data keys in the order of column access.
 */
export const getDataColumns = <Item extends object>(
	columns: Column<Item>[]
): DataColumn<Item>[] => {
	const dataColumns: DataColumn<Item>[] = [];
	columns.forEach((column) => {
		if (column instanceof DataColumn) {
			dataColumns.push(column);
		} else if (column instanceof GroupColumn) {
			dataColumns.push(...getDataColumns(column.columns));
		}
	});
	return dataColumns;
};
