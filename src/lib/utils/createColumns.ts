import { type Column, GroupColumn, DataColumn } from '$lib/models/Column';
import type { GroupColumnDef, DataColumnDef } from '$lib/types/ColumnDef';

export const createColumns = <Item extends object>(columns: Column<Item>[]): Column<Item>[] => {
	return columns;
};

export const createGroup = <Item extends object>(
	groupColumnDef: GroupColumnDef<Item>
): GroupColumn<Item> => {
	return new GroupColumn({
		...groupColumnDef,
	});
};

export const createDataColumn = <Item extends object>(
	dataColumnDef: DataColumnDef<Item>
): DataColumn<Item> => {
	return new DataColumn({
		...dataColumnDef,
	});
};
