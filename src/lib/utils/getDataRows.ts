import type { DataColumn } from '$lib/models/Column';
import { DataCell } from '$lib/models/DataCell';
import { DataRow } from '$lib/models/DataRow';
import type { TableInstance } from '$lib/models/TableInstance';

export const getDataRows = <Item extends object>(
	table: TableInstance<Item>,
	data: Item[],
	dataColumns: DataColumn<Item>[]
): DataRow<Item>[] => {
	return data.map(
		(item) =>
			new DataRow({
				cells: dataColumns.map(
					(column) =>
						new DataCell({
							table,
							key: column.key,
							value: item[column.key],
							label: column.cell,
						})
				),
			})
	);
};
