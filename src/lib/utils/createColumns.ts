import type { Column, ColumnGroup, ColumnData } from '$lib/models/Column';
import type { ColumnGroupProps, ColumnDataProps } from '$lib/types/ColumnProps';

export const createColumns = <Item extends object>(columns: Column<Item>[]): Column<Item>[] => {
	return columns;
};

export const createGroup = <Item extends object>(
	groupProps: ColumnGroupProps<Item>
): ColumnGroup<Item> => {
	return {
		type: 'group',
		...groupProps,
	};
};

export const createDataColumn = <Item extends object>(
	columnProps: ColumnDataProps<Item>
): ColumnData<Item> => {
	return {
		type: 'data',
		...columnProps,
	};
};
