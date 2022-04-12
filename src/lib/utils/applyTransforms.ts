import type { DataTransformer } from '$lib/types/DataTransformer';

export const applyTransforms = <Item>(
	data: Item[],
	transformers: DataTransformer<Item>[]
): Item[] => {
	let result = data;
	transformers.forEach((transformer) => {
		result = transformer(data);
	});
	return result;
};
