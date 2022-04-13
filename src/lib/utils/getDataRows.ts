import type { ColumnData } from '$lib/types/Column';
import type { DataRow } from '$lib/types/DataRow';

export const getDataRows = <Item extends object>(
	data: Item[],
	dataColumns: ColumnData<Item>[]
): DataRow<Item>[] => {
	return data.map((item) => ({
		cells: dataColumns.map((column) => ({
			key: column.key,
			value: item[column.key],
			label: column.cell,
		})),
	}));
};
