import type { DataCell } from '$lib/types/DataCell';

export const getDataRows = <Item extends object>(
	data: Item[],
	keys: (keyof Item)[]
): DataCell<Item>[][] => {
	return data.map((item) =>
		keys.map((key) => ({
			key,
			value: item[key],
		}))
	);
};
