import { type Column, GroupColumn, DataColumn } from '$lib/models/Column';
import type { CreateGroupProps, CreateDataColumnProps } from '$lib/types/ColumnProps';

export const createColumns = <Item extends object>(columns: Column<Item>[]): Column<Item>[] => {
	return columns;
};

export const createGroup = <Item extends object>(
	groupProps: CreateGroupProps<Item>
): GroupColumn<Item> => {
	return new GroupColumn({
		...groupProps,
	});
};

export const createDataColumn = <Item extends object>(
	columnProps: CreateDataColumnProps<Item>
): DataColumn<Item> => {
	return new DataColumn({
		...columnProps,
	});
};
