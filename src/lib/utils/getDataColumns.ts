import type { ColumnData, DataColumnData } from '$lib/models/Column';

/**
 * Get the data keys in the order of column access. This is the same as the
 * in-order traversal of leaf nodes in the column structure.
 * @param columns The column structure grouped by columns;
 * @returns A list of data keys in the order of column access.
 */
export const getDataColumns = <Item extends object>(
	columns: ColumnData<Item>[]
): DataColumnData<Item>[] => {
	const dataColumns: DataColumnData<Item>[] = [];
	columns.forEach((column) => {
		if (column.type === 'data') {
			dataColumns.push(column);
		} else {
			dataColumns.push(...getDataColumns(column.columns));
		}
	});
	return dataColumns;
};
