import type { DataRow } from '$lib/types/DataRow';

export const getDataRows = <Item extends object>(
	data: Item[],
	keys: (keyof Item)[]
): DataRow<Item>[] => {
	return data.map((item) => ({
		cells: keys.map((key) => ({
			key,
			value: item[key],
		})),
	}));
};
