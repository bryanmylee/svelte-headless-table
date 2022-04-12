import type { Data } from '$lib/types/Data';

export const getDataRows = <Item extends object>(
	data: Item[],
	keys: (keyof Item)[]
): Data<Item>[][] => {
	return data.map((item) =>
		keys.map((key) => ({
			key,
			value: item[key],
		}))
	);
};
