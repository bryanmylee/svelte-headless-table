import type { ColumnData, GroupColumnData, DataColumnData } from '$lib/models/Column';
import type { ColumnGroupProps, ColumnDataProps } from '$lib/types/ColumnProps';

export const createColumns = <Item extends object>(
	columns: ColumnData<Item>[]
): ColumnData<Item>[] => {
	return columns;
};

export const createGroup = <Item extends object>(
	groupProps: ColumnGroupProps<Item>
): GroupColumnData<Item> => {
	return {
		type: 'group',
		...groupProps,
	};
};

export const createDataColumn = <Item extends object>(
	columnProps: ColumnDataProps<Item>
): DataColumnData<Item> => {
	return {
		type: 'data',
		...columnProps,
	};
};
