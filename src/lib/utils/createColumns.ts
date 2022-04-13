import type { Column, ColumnGroup, ColumnData } from '$lib/types/Column';
import type { ColumnGroupProps, ColumnDataProps } from '$lib/types/ColumnProps';

export const createColumns = <Item extends object>(columns: Column<Item>[]): Column<Item>[] => {
	return columns;
};

export const createGroup = <Item extends object>(
	groupDef: ColumnGroupProps<Item>
): ColumnGroup<Item> => {
	return {
		type: 'group',
		...groupDef,
	};
};

export const createDataColumn = <Item extends object>(
	columnDef: ColumnDataProps<Item>
): ColumnData<Item> => {
	return {
		type: 'data',
		...columnDef,
	};
};
