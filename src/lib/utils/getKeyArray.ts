import type { Column, ColumnGroup, ColumnLeaf } from '$lib/types/Column';

/**
 * Get the data keys in the order of column access. This is the same as the
 * in-order traversal of leaf nodes in the column structure.
 * @param columns The column structure grouped by columns;
 * @returns A list of data keys in the order of column access.
 */
export const getKeyArray = <Item extends object>(columns: Column<Item>[]): (keyof Item)[] => {
	const keys: (keyof Item)[] = [];
	columns.forEach((column) => {
		if ((column as ColumnLeaf<Item>).key !== undefined) {
			const leaf = column as ColumnLeaf<Item>;
			keys.push(leaf.key);
		} else {
			const group = column as ColumnGroup<Item>;
			const childKeys = getKeyArray(group.columns);
			keys.push(...childKeys);
		}
	});
	return keys;
};
